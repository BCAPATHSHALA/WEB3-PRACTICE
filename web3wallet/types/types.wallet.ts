// Represents the main recovery phrase used to derive all wallets
export interface IMainRecoveryPhrase {
  mnemonicPhrase: string;        // 12 or 24-word human-readable phrase
  masterSeedPhrase: string;      // Hex string of derived binary seed
}

// Represents a single wallet (Solana or Ethereum)
export interface IWallet {
  path: string;                  // Derivation path (e.g., m/44'/501'/0'/<uuid>')
  derivedSeed: string;           // Hex-encoded derived seed
  privateKey: string;            // Base58 (Solana) or Hex (Ethereum)
  publicKey: string;             // Public address
  coinType: string;              // "501" for Solana, "60" for Ethereum
  accountNumber: string;         // UUID for unique identification
  index: number;                // derivative paths use deterministic index instead of random
}

export type StorageValue =
  | string
  | number
  | boolean
  | object
  | IMainRecoveryPhrase
  | IWallet
  | null;
