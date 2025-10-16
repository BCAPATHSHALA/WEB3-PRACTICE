// Represents the main recovery phrase used to derive all wallets
export interface IMainRecoveryPhrase {
  mnemonicPhrase: string;        // 12 or 24-word human-readable phrase
  masterSeedPhrase: string;      // Hex string of derived binary seed
}

// Represents a single wallet (Solana or Ethereum)
export interface IWallet {
  path: string;                  // Derivation path (e.g., m/44'/501'/0'/<index>')
  derivedSeed: string;           // Hex-encoded derived seed
  privateKey: string;            // Base58 (Solana) or Hex (Ethereum)
  publicKey: string;             // Public address
  coinType: string;              // "501" for Solana, "60" for Ethereum
  accountNumber: string;         // UUID for unique identification
  index: number;                 // derivative paths use deterministic index instead of random
  walletCount:{                  // For tracking wallets this will helps to recover the wallet using the main recovery phrase
    total: number;
    solana: number;
    ethereum: number;
  };
}

// The encrypted vault metadata structure we save in localStorage
export interface IPasswordMeta {
  hint?: string | null;    // Optional hint
  createdAt: string;       // ISO timestamp
  encryptedVault: string;  // base64 or JSON-stringified payload from `encryptData`
}

export type StorageValue =
  | string
  | number
  | boolean
  | object
  | IMainRecoveryPhrase
  | IWallet
  | IPasswordMeta
  | null;
