import { IMainRecoveryPhrase } from "@/types/types.wallet";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";

// Generate a new mnemonic phrase and derive the master seed phrase
const generateMasterSeedPhraseUsingMnemonicPhrase = (): IMainRecoveryPhrase => {
  const mnemonicPhrase = generateMnemonic();
  const masterSeedPhrase = mnemonicToSeedSync(mnemonicPhrase);
  return {
    mnemonicPhrase,
    masterSeedPhrase: masterSeedPhrase.toString("hex"),
  };
};

export { generateMasterSeedPhraseUsingMnemonicPhrase };
