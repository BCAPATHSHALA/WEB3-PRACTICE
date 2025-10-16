// Centralized keys used for localStorage so we don't mistype strings across the app
const STORAGE_KEYS = {
  PASSWORD_KEY: "wallet_password_meta", // stores encrypted vault metadata { encryptedVault, hint, createdAt }
  ZUSTAND_STATE: "zustand_state",       // useful for debugging & testing
  RESET_DONE: "wallet_reset_done",      // optional flag to show onboarding after reset
};

export { STORAGE_KEYS };
