import { IMainRecoveryPhrase, IWallet } from "@/types/types.wallet";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { v4 as uuidv4 } from "uuid";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";
import bs58 from "bs58";
import {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
} from "./local.storage";
import { STORAGE_KEYS } from "./constants";

// ################# SERVER & CLIENT SIDE - CORE WALLET FUNCTIONS #################
// Generate a new mnemonic phrase and derive the master seed phrase
const generateMasterSeedPhraseUsingMnemonicPhrase = (): IMainRecoveryPhrase => {
  const mnemonicPhrase = generateMnemonic();
  const masterSeedPhrase = mnemonicToSeedSync(mnemonicPhrase);
  return {
    mnemonicPhrase,
    masterSeedPhrase: masterSeedPhrase.toString("hex"),
  };
};

// Generate a new wallet based on the master seed phrase and coin type
const generateWallet = (
  masterSeedPhrase: string,
  coinType: string
): IWallet => {
  const accountNumber = uuidv4();
  const path = `m/44'/${coinType}'/0'/${Math.floor(Math.random() * 1000)}'`;
  const derivedSeed = derivePath(path, masterSeedPhrase.toString());

  let privateKey: string;
  let publicKey: string;

  if (coinType === "501") {
    // SOLANA COIN
    const secret = nacl.sign.keyPair.fromSeed(derivedSeed.key).secretKey;
    const address = Keypair.fromSecretKey(secret).publicKey;
    const secretKeyEncoded = bs58.encode(secret);
    const publicKeyEncoded = bs58.encode(address.toBytes());
    privateKey = secretKeyEncoded;
    publicKey = publicKeyEncoded;
  } else if (coinType === "60") {
    // ETHEREUM COIN
    const wallet = new ethers.Wallet(
      Buffer.from(derivedSeed.key).toString("hex")
    );
    const secret = wallet.privateKey;
    const address = wallet.address;
    privateKey = secret;
    publicKey = address;
  } else {
    throw new Error("Unsupported coin type");
  }

  return {
    path,
    derivedSeed: derivedSeed.key.toString("hex"),
    privateKey,
    publicKey,
    coinType,
    accountNumber,
  };
};

// ################# CLIENT SIDE - WALLET MANAGEMENT FUNCTIONS #################
// Add a new wallet (creates master seed if not exist)
const onAddWallet = (coinType: string): IWallet => {
  let phrase = getLocalStorage<IMainRecoveryPhrase>(STORAGE_KEYS.MAIN_PHRASE);

  // Step 1: Create if not exist
  if (!phrase) {
    phrase = generateMasterSeedPhraseUsingMnemonicPhrase();
    setLocalStorage(STORAGE_KEYS.MAIN_PHRASE, phrase);
  } else if (!validateMnemonic(phrase.mnemonicPhrase)) {
    throw new Error("Invalid mnemonic phrase found in storage.");
  }

  // Step 2: Generate wallet
  const wallet = generateWallet(phrase.masterSeedPhrase, coinType);

  // Step 3: Save wallet
  const existingWallets =
    getLocalStorage<IWallet[]>(STORAGE_KEYS.WALLETS) || [];
  existingWallets.push(wallet);
  setLocalStorage(STORAGE_KEYS.WALLETS, existingWallets);

  return wallet;
};

// Get a specific wallet by account number or private key
const onGetWallet = (
  identifier: string, // can be accountNumber or privateKey
  keyType: "accountNumber" | "privateKey" = "accountNumber"
): IWallet | null => {
  const wallets = getLocalStorage<IWallet[]>(STORAGE_KEYS.WALLETS) || [];
  return wallets.find((w) => w[keyType] === identifier) || null;
};

// Delete a specific wallet by account number
const onDeleteWallet = (accountNumber: string): void => {
  const wallets = getLocalStorage<IWallet[]>(STORAGE_KEYS.WALLETS) || [];
  const filtered = wallets.filter((w) => w.accountNumber !== accountNumber);
  setLocalStorage(STORAGE_KEYS.WALLETS, filtered);
};

// Update (regenerate) a specific wallet by account number (uses existing coin type)
const onUpdateWallet = (accountNumber: string): IWallet | null => {
  const wallets = getLocalStorage<IWallet[]>(STORAGE_KEYS.WALLETS) || [];
  const wallet = wallets.find((w) => w.accountNumber === accountNumber);
  if (!wallet) return null;

  const newWallet = generateWallet(
    getLocalStorage<IMainRecoveryPhrase>(STORAGE_KEYS.MAIN_PHRASE)!
      .masterSeedPhrase,
    wallet.coinType
  );

  const updatedWallets = wallets.map((w) =>
    w.accountNumber === accountNumber ? { ...w, ...newWallet } : w
  );

  setLocalStorage(STORAGE_KEYS.WALLETS, updatedWallets);
  return newWallet;
};

// Get all wallets with optional filtering by coin type
const onGetAllWallets = () => {
  const wallets = getLocalStorage<IWallet[]>(STORAGE_KEYS.WALLETS) || [];
  return {
    allWallets: wallets,
    solanaWallets: wallets.filter((w) => w.coinType === "501"),
    ethereumWallets: wallets.filter((w) => w.coinType === "60"),
  };
};

// Delete all wallets but keep the master seed
const onDeleteAllWallets = (): void => {
  removeLocalStorage(STORAGE_KEYS.WALLETS);
};

// Clear all data including master seed and wallets
const onClearAllWalletData = (): void => {
  clearLocalStorage();
};

// Get recovery keys
const onGetRecoveryPhrase = () => {
  const recoveryKeys = getLocalStorage<IMainRecoveryPhrase>(
    STORAGE_KEYS.MAIN_PHRASE
  );
  return recoveryKeys
    ? {
        mnemonicPhrase: recoveryKeys.mnemonicPhrase,
        masterSeedPhrase: recoveryKeys.masterSeedPhrase,
      }
    : null;
};

export {
  generateMasterSeedPhraseUsingMnemonicPhrase,
  generateWallet,
  onAddWallet,
  onGetWallet,
  onDeleteWallet,
  onUpdateWallet,
  onGetAllWallets,
  onDeleteAllWallets,
  onClearAllWalletData,
  onGetRecoveryPhrase,
};
