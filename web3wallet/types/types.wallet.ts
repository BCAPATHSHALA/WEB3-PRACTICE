export interface IMainRecoveryPhrase {
  mnemonicPhrase: string;
  masterSeedPhrase: string;
}

export interface IWallet {
  path: string;
  derivedSeed: string;
  privateKey: string;
  publicKey: string;
  coinType: string;
  accountNumber: string;
}

export type StorageValue =
  | string
  | number
  | boolean
  | object
  | IMainRecoveryPhrase
  | IWallet
  | null;
