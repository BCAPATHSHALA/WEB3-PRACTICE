// Centralized keys used for localStorage so we don't mistype strings across the app
const STORAGE_KEYS = {
  PASSWORD_KEY: "wallet_password_meta",         // stores encrypted vault metadata { encryptedVault, hint, createdAt }
  ZUSTAND_STATE: "zustand_state",               // useful for debugging & testing
  RESET_DONE: "wallet_reset_done",              // optional flag to show onboarding after reset
  MASK_SECRETS_DEFAULT: "mask-secrets-default", // hide secrets by default
};

// Cookies Storage Keys for session-based checks
const COOKIE_KEYS = {
  IS_UNLOCKED: "wallet_unlocked",               // session-based check for unlocked wallet
  HAS_VAULT: "wallet_vault_exists",             // session-based check for existing vault
};

export { STORAGE_KEYS, COOKIE_KEYS };
