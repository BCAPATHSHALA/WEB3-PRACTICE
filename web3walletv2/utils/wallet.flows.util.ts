/*
 * Create wallet flow 1:
 * - Generate mnemonic (bip39)
 * - Derive master seed
 * - Derive first account (index 0) for Ethereum & Solana (demo)
 * - Save mnemonic temporarily in-memory (Zustand) so UI shows recovery phrase
 * - When user clicks confirm, call finalizeCreateWithPassword()
 */

import {
  getLocalStorage,
  setLocalStorage,
  removeLocalStorage,
} from "@/utils/local.storage.util";
import { STORAGE_KEYS } from "@/utils/constants.util";
import { useWalletStore } from "@/store/use.wallet.store";
import { decryptData, encryptData } from "@/utils/crypto.util";
import { generateWalletFromSeed } from "./wallet.manager.util";
import { generateMasterSeedPhraseUsingMnemonicPhrase } from "@/utils/mnemonic.util";
import {
  IMainRecoveryPhrase,
  IPasswordMeta,
  IWallet,
} from "@/types/types.wallet";
import { mnemonicToSeedSync, validateMnemonic } from "bip39";

/**
 * Step A: Start create flow:
 * - generate mnemonic and store in memory (Zustand)
 * - generate first account (index 0) for Ethereum & Solana (Optional)
 * @return recovery phrase (mnemonicPhrase, masterSeedPhrase)
 */
const startCreateFlow = () => {
  try {
    // Step 1: Generate mnemonic & master seed
    const phrase = generateMasterSeedPhraseUsingMnemonicPhrase();

    // Step 2: Set the recovery phrase (mnemonicPhrase, masterSeedPhrase) in memory
    useWalletStore.getState().setRecovery(phrase);

    // Optionally set the first wallet preview in memory:
    const firstEthereumWallet = generateWalletFromSeed(
      phrase.masterSeedPhrase,
      "60",
      0,
      0
    );
    const firstSolanaWallet = generateWalletFromSeed(
      phrase.masterSeedPhrase,
      "501",
      0,
      1
    );

    // Set the first wallet preview in memory
    useWalletStore
      .getState()
      .setWallets([firstEthereumWallet, firstSolanaWallet]);

    // Step 3: Return the recovery phrase (Note: do NOT persist plain data to localStorage here, only store in memory)
    return phrase;
  } catch (error) {
    throw new Error("Failed to generate recovery phrase.");
  }
};

/**
 * Step B: Finalize create flow when user confirms the recovery phrase and sets a password:
 * - encrypt vault (mnemonic & derived wallets)
 * - remove plaintext from memory
 * @param password string - user provided password
 * @param hint string - optional user provided hint
 * @returns { success: boolean; message: string }
 */
const finalizeCreateWithPassword = async (
  password: string,
  hint?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Step 1: Encrypt the wallet & recovery phrase using password
    const { wallets, recovery } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    const payload = JSON.stringify({ wallets, recovery });
    const encryptedVault = await encryptData(payload, password);

    //Step 2: Store encrypted data in localStorage
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, {
      hint: hint || null,
      createdAt: new Date().toISOString(),
      encryptedVault,
    });

    // Step 3: Clear plaintext from memory from zustand
    useWalletStore.getState().clear();

    return {
      success: true,
      message: "Wallet created and encrypted successfully.",
    };
  } catch (error) {
    throw new Error("Failed to encrypt wallet.");
  }
};

/**
 * Step C: Add more wallets to the vault:
 * - user provide old password and coin type
 * - validate user password with old password
 * - get recovery phrase & wallets from zustand
 * @param password string - user password
 * @param coinType string - "60" or "501"
 * @return { success: boolean; message: string }
 */
const onAddWallet = async (password: string, coinType: string) => {
  try {
    // Step 0: Validate user password with old password
    const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
    if (!meta) {
      throw new Error("No encrypted vault found.");
    }

    const decrypted = await decryptData(meta.encryptedVault, password);
    if (!decrypted) {
      throw new Error("Invalid password.");
    }

    // Step 1: Get recovery phrase & wallets from zustand
    const { recovery, wallets } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    // Step 2: Filter the wallets by coin type (ethereum - "60" or solana - "501")
    const filteredWallets = wallets.filter((w) => w.coinType === coinType);
    const index = filteredWallets.length;

    // Step 3: Create new wallet using mnemonic phrase
    const wallet = generateWalletFromSeed(
      recovery.masterSeedPhrase,
      coinType,
      index,
      wallets.length
    );

    // Step 4: Add new wallet to zustand
    useWalletStore.getState().setWallets([...wallets, { ...wallet, coinType }]);

    // Step 5: Encrypt the wallet & recovery phrase using password and save in localStorage
    const payload = JSON.stringify({ wallets, recovery });
    const encryptedVault = await encryptData(payload, password);
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, encryptedVault);

    return { success: true, message: "Wallet added successfully." };
  } catch (error) {
    throw new Error("Failed to add wallet.");
  }
};

/**
 * Step D: Get a specific wallet by account number or private key:
 * - get recovery phrase & wallets from zustand
 * - filter the wallets by account number or private key
 * @param identifier string - account number or private key
 * @param keyType string - "accountNumber" or "privateKey"
 * @returns { IWallet | null }
 */
const onGetWallet = (
  identifier: string,
  keyType: "accountNumber" | "privateKey" = "accountNumber"
): IWallet | null => {
  try {
    // Step 1: Get recovery phrase & wallets from zustand
    const { recovery, wallets } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    // Step 2: Filter the wallets by account number or private key
    const wallet = wallets.find((w) => w[keyType] === identifier) || null;
    return wallet;
  } catch (error) {
    throw new Error("Failed to get wallet.");
  }
};

/**
 * Step E: Delete a specific wallet by account number & old password:
 * - user provide old password and account number
 * - validate user password with old password
 * - get recovery phrase & wallets from zustand
 * - filter the wallets by account number
 * - encrypt the wallet & recovery phrase using password
 * - save in localStorage
 * @param accountNumber string - account number
 * @param password string - user password
 * @return { success: boolean; message: string }
 */
const onDeleteWallet = async (accountNumber: string, password: string) => {
  try {
    // Step 0: Validate user password with old password
    const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
    if (!meta) {
      throw new Error("No encrypted vault found.");
    }

    const decrypted = await decryptData(meta.encryptedVault, password);
    if (!decrypted) {
      throw new Error("Invalid password.");
    }

    // Step 1: Get recovery phrase & wallets from zustand
    const { recovery, wallets } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    // Step 2: Filter the wallets by account number
    const filteredWallets = wallets.filter(
      (w) => w.accountNumber !== accountNumber
    );

    // Step 3: Encrypt the wallet & recovery phrase using password and save in localStorage
    const payload = JSON.stringify({ wallets: filteredWallets, recovery });
    const encryptedVault = await encryptData(payload, password);
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, encryptedVault);

    return { success: true, message: "Wallet deleted successfully." };
  } catch (error) {
    throw new Error("Failed to delete wallet.");
  }
};

/**
 * Step F: Get all wallets with optional filtering by coin type:
 * - get wallets from zustand
 * - filter the wallets by coin type (ethereum - "60" or solana - "501")
 * @return allWallets, solanaWallets, ethereumWallets
 */
const onGetAllWallets = async () => {
  try {
    // Step 1: Get recovery phrase & wallets from zustand
    const { wallets } = useWalletStore.getState();
    if (!wallets) {
      throw new Error("No wallets found in memory (UI flow broken).");
    }

    // Step 2: Filter the wallets by coin type (ethereum - "60" or solana - "501")
    const solanaWallets = wallets.filter((w) => w.coinType === "501");
    const ethereumWallets = wallets.filter((w) => w.coinType === "60");

    // Step 3: Return the filtered wallets
    return { allWallets: wallets, solanaWallets, ethereumWallets };
  } catch (error) {
    throw new Error("Failed to get all wallets.");
  }
};

/**
 * Step G: Delete all wallets but keep the master seed:
 * - user provide old password
 * - validate user password with old password
 * - get recovery phrase & wallets from zustand
 * - encrypt the wallet & recovery phrase using password
 * - remove the wallets from localStorage
 * - update the wallets in zustand
 * @param password string - user password
 * @return { success: boolean; message: string }
 */
const onDeleteAllWallets = async (password: string) => {
  try {
    // Step 0: Validate user password with old password
    const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
    if (!meta) {
      throw new Error("No encrypted vault found.");
    }

    const decrypted = await decryptData(meta.encryptedVault, password);
    if (!decrypted) {
      throw new Error("Invalid password.");
    }

    // Step 1: Get recovery phrase & wallets from zustand
    const { recovery, wallets } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    // update the empty wallets in zustand
    useWalletStore.getState().setWallets([]);

    // Step 2: Decrypt the empty wallet & recovery phrase using password and save in localStorage
    const payload = JSON.stringify({ wallets, recovery });
    const encryptedVault = await encryptData(payload, password);
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, encryptedVault);

    return { success: true, message: "All wallets deleted successfully." };
  } catch (error) {
    throw new Error("Failed to delete all wallets.");
  }
};

/**
 * Step H: Get the recovery phrase:
 * - user provide old password
 * - validate user password with old password
 * - get the recovery phrase from zustand memory
 * @param password string - user password
 * @return mnemonicPhrase, masterSeedPhrase
 */
const onGetRecoveryPhrase = async (password: string) => {
  try {
    // Step 0: Validate user password with old password
    const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
    if (!meta) {
      throw new Error("No encrypted vault found.");
    }

    const decrypted = await decryptData(meta.encryptedVault, password);
    if (!decrypted) {
      throw new Error("Invalid password.");
    }

    // Step 1: Get recovery phrase & wallets from zustand
    const { recovery } = useWalletStore.getState();
    if (!recovery) {
      throw new Error("No recovery phrase in memory (UI flow broken).");
    }

    // Step 2: Return the recovery phrase
    return recovery
      ? {
          mnemonicPhrase: recovery.mnemonicPhrase,
          masterSeedPhrase: recovery.masterSeedPhrase,
        }
      : null;
  } catch (error) {
    throw new Error("Failed to get recovery phrase.");
  }
};

/*
 * Import wallet flow 2:
 * - Accept a mnemonic from user (12 / 24 words)
 * - Validate mnemonic
 * - Build derived wallets (like create flow)
 * - Encrypt with password and store encrypted vault
 */

/**
 * Step A: Accept a mnemonic from user (12 / 24 words)
 * - Even if localStorage is empty, the same mnemonic always regenerates the same set of wallets (like phantom wallet)
 * @param mnemonic string - recovery phrase
 * @param password string - user password
 * @param hint string - optional user hint
 * @returns { success: boolean; message: string }
 */

const importWalletWithMnemonic = async (
  mnemonic: string,
  password: string,
  hint?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Step 1: Normalize and validate mnemonic
    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
    if (!validateMnemonic(normalized)) {
      throw new Error(
        "Invalid recovery phrase. Please check your words and order."
      );
    }

    // Step 2: Derive master seed
    const seed = mnemonicToSeedSync(normalized);
    const masterSeedHex = seed.toString("hex");

    // Step 3: Derive multiple wallets for each supported chain
    const MAX_WALLETS = 1; // todo: we can make this dynamic in the future (take user input)
    const CHAINS = [
      { name: "ethereum", coinType: "60" },
      { name: "solana", coinType: "501" },
    ];

    const derivedWallets: any[] = [];

    for (const chain of CHAINS) {
      for (let index = 0; index < MAX_WALLETS; index++) {
        const wallet = generateWalletFromSeed(
          masterSeedHex,
          chain.coinType,
          index
        );
        if (wallet) {
          derivedWallets.push({
            ...wallet,
          });
        }
      }
    }

    // Step 4: Encrypt everything
    const recovery: IMainRecoveryPhrase = {
      mnemonicPhrase: normalized,
      masterSeedPhrase: masterSeedHex,
    };
    const payload = JSON.stringify({ wallets: derivedWallets, recovery });
    const encryptedVault = await encryptData(payload, password);

    // Step 5: Store encrypted data
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, {
      hint: hint || null,
      createdAt: new Date().toISOString(),
      encryptedVault,
    });

    // Step 6: Update memory state (for unlocked session)
    const walletStore = useWalletStore.getState();
    walletStore.clear();
    walletStore.setWallets(derivedWallets);
    walletStore.setRecovery(recovery);
    walletStore.setUnlocked(true);

    return {
      success: true,
      message: "Wallets imported successfully!",
    };
  } catch (error) {
    console.error(error);
    throw new Error("Failed to import wallet.");
  }
};

/*
 * Unlock flow 3:
 * - Decrypt encryptedVault from localStorage with provided password
 * - Load decrypted wallets & recovery into Zustand memory (in-memory only)
 * - Do NOT write plaintext to localStorage
 */

/**
 * Step A: Decrypt encryptedVault from localStorage with provided password
 * @param password string - user password
 * @returns {success: boolean; message: string}
 */
const unlockWithPassword = async (
  password: string
): Promise<{ success: boolean; message: string }> => {
  // Step 1: Get encryptedVault from localStorage
  const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
  if (!meta || !meta.encryptedVault) {
    throw new Error("No encrypted vault found on this device.");
  }

  try {
    // Step 2: Decrypt with password and parse
    const decrypted = await decryptData(meta.encryptedVault, password);
    const parsed = JSON.parse(decrypted);

    // Step 3: Load decrypted wallets & recovery into zustand
    useWalletStore.getState().setWallets(parsed.wallets || []);
    useWalletStore.getState().setRecovery(parsed.recovery || null);
    useWalletStore.getState().setUnlocked(true);

    return { success: true, message: "Unlocked successfully." };
  } catch (err) {
    throw new Error(
      "Failed to decrypt — incorrect password or corrupted vault."
    );
  }
};

/*
 * Reset wallet flow (MetaMask-style) 4:
 * - Option A: User provides their Secret Recovery Phrase with new password
 *   -> derive wallets, encrypt with new password, replace vault, load into memory
 * - Option B: If user just clicks "Reset and wipe app" without providing phrase,
 *   -> wipe everything and show onboarding (user loses wallets permanently)
 */

/**
 * Option A:
 * When user forgot the password while unlocked then user can reset the wallet
 * with new password and secret recovery phrase.
 *
 * Reset using secret recovery phrase (recommended flow because this is more secure):
 * - User provides the secret phrase and new password
 * - Validate phrase, derive all wallets, encrypt them with new password, replace vault
 * @param mnemonic string - recovery phrase
 * @param newPassword string - user password
 * @param hint string - optional user hint
 * @returns { success: boolean; message: string }
 */
const resetWithRecoveryPhrase = async (
  mnemonic: string,
  newPassword: string,
  hint?: string
): Promise<{ success: boolean; message: string }> => {
  try {
    // Step 1: Normalize and validate mnemonic
    const normalized = mnemonic.trim().toLowerCase().replace(/\s+/g, " ");
    if (!validateMnemonic(normalized)) {
      throw new Error("Invalid Secret Recovery Phrase.");
    }

    // Step 2: Derive master seed from mnemonic
    const seed = mnemonicToSeedSync(normalized);
    const masterSeedHex = seed.toString("hex");

    // Step 3: Derive multiple accounts per supported chain
    const MAX_WALLETS = 1; // todo: we can make this dynamic in the future (take user input)
    const CHAINS = [
      { name: "ethereum", coinType: "60" },
      { name: "solana", coinType: "501" },
    ];

    const derivedWallets: any[] = [];

    for (const chain of CHAINS) {
      for (let index = 0; index < MAX_WALLETS; index++) {
        const wallet = generateWalletFromSeed(
          masterSeedHex,
          chain.coinType,
          index
        );
        if (wallet) {
          derivedWallets.push({
            ...wallet,
          });
        }
      }
    }

    if (derivedWallets.length === 0) {
      throw new Error("No wallets could be derived from the recovery phrase.");
    }

    // Step 4: Create recovery object
    const recovery: IMainRecoveryPhrase = {
      mnemonicPhrase: normalized,
      masterSeedPhrase: masterSeedHex,
    };

    // Step 5: Encrypt all wallets with the new password
    const payload = JSON.stringify({ wallets: derivedWallets, recovery });
    const encryptedVault = await encryptData(payload, newPassword);

    // Step 6: Replace old vault in localStorage
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, {
      hint: hint || null,
      createdAt: new Date().toISOString(),
      encryptedVault,
    });

    // Step 7: Clear any old session data
    const walletStore = useWalletStore.getState();
    walletStore.clear();
    walletStore.setWallets(derivedWallets);
    walletStore.setRecovery(recovery);
    walletStore.setUnlocked(true);

    return {
      success: true,
      message: "Wallet reset successfully using recovery phrase.",
    };
  } catch (error: any) {
    console.error("Wallet reset failed:", error);
    throw new Error(error?.message || "Failed to reset wallet.");
  }
};

/**
 * Wipe everything immediately (use carefully because this is permanently destructive):
 * - remove all data(mnemonic & derived wallets) from localStorage
 * - clear zustand memory
 * @returns {success: boolean}
 * */
const wipeAllAndShowOnboarding = async (): Promise<{
  success: boolean;
}> => {
  try {
    // Step 1: Clear sensitive data from localStorage
    removeLocalStorage(STORAGE_KEYS.PASSWORD_KEY);
    removeLocalStorage(STORAGE_KEYS.RESET_DONE);
    removeLocalStorage(STORAGE_KEYS.ZUSTAND_STATE);

    // Step 2: clear zustand memory from localStorage
    if (useWalletStore.persist?.clearStorage) {
      useWalletStore.persist.clearStorage();
    }

    // Step 3: Clear zustand memory from Zustand state
    useWalletStore.getState().clear();
    return { success: true };
  } catch (error) {
    throw new Error("Failed to wipe wallet.");
  }
};

/*
 * Change password 5:
 * - Decrypt vault using old password
 * - Re-encrypt the exact same payload using new password
 * - Replace vault in localStorage
 */

/**
 * Change the current password with new password
 * @param oldPassword string
 * @param newPassword string
 * @returns {success: boolean; message: string}
 * */
const changePassword = async (
  oldPassword: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> => {
  // Step 1: Get encryptedVault from localStorage
  const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
  if (!meta || !meta.encryptedVault) {
    throw new Error("No encrypted vault found.");
  }

  try {
    // Step 2: Decrypt with old password
    const decrypted = await decryptData(meta.encryptedVault, oldPassword);
    // Step 3: Re-encrypt with new password
    const newEncrypted = await encryptData(decrypted, newPassword);

    // Step 4: Replace vault in localStorage
    setLocalStorage(STORAGE_KEYS.PASSWORD_KEY, {
      ...meta,
      encryptedVault: newEncrypted,
      createdAt: new Date().toISOString(),
    });

    return { success: true, message: "Password updated successfully." };
  } catch (err) {
    throw new Error("Old password is incorrect or vault is corrupted.");
  }
};

export {
  startCreateFlow,
  finalizeCreateWithPassword,
  onAddWallet,
  onGetWallet,
  onDeleteWallet,
  onGetAllWallets,
  onDeleteAllWallets,
  onGetRecoveryPhrase,
  importWalletWithMnemonic,
  unlockWithPassword,
  resetWithRecoveryPhrase,
  wipeAllAndShowOnboarding,
  changePassword,
};
