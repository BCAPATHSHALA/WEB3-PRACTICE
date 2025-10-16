"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { devtools, createJSONStorage } from "zustand/middleware";
import { IMainRecoveryPhrase, IWallet } from "@/types/types.wallet";
import { STORAGE_KEYS } from "@/utils/constants.util";
import {
  getLocalStorage,
  removeLocalStorage,
  setLocalStorage,
} from "@/utils/local.storage.util";

interface WalletState {
  wallets: IWallet[];
  recovery: IMainRecoveryPhrase | null;
  unlocked: boolean;
  setWallets: (w: IWallet[]) => void;
  setRecovery: (r: IMainRecoveryPhrase) => void;
  setUnlocked: (v: boolean) => void;
  clear: () => void;
}

/**
 * Way 01: Zustand store using devtools middleware without persist
 * - Does not save data into localStorage
 * - Problem with this is that data is lost on reload
 */
// export const useWalletStore = create(
//   devtools<WalletState>((set) => ({
//     wallets: [],
//     recovery: null,
//     unlocked: false,

//     // Actions
//     setWallets: (wallets) => set({ wallets }),
//     setRecovery: (recovery) => set({ recovery }),
//     setUnlocked: (unlocked) => set({ unlocked }),
//     clear: () => set({ wallets: [], recovery: null, unlocked: false }),
//   }))
// );

/**
 * Way 2: Zustand store using persist and devtools middleware
 * - Saves data into localStorage automatically
 * - Auto rehydrates on reload with persisted data
 * - This mimics MetaMask’s behavior (session persistence)
 * - Problem with this chance is that leakage of data is possible due to store plaintext in localStorage
 */
// export const useWalletStore = create<WalletState>()(
//   devtools(
//     persist(
//       (set) => ({
//         wallets: [],
//         recovery: null,
//         unlocked: false,

//         // Actions
//         setWallets: (wallets) => set({ wallets }),
//         setRecovery: (recovery) => set({ recovery }),
//         setUnlocked: (unlocked) => set({ unlocked }),
//         clear: () => set({ wallets: [], recovery: null, unlocked: false }),
//       }),
//       {
//         name: "web3-wallet-storage", // localStorage key
//         partialize: (state) => ({
//           // Define what to persist
//           wallets: state.wallets,
//           recovery: state.recovery,
//           unlocked: state.unlocked,
//         }),
//       }
//     )
//   )
// );

/**
 * Way 3: Zustand store using persist and devtools & encrypt middleware
 * - Encrypts data before saving into localStorage
 * - Decrypts data from localStorage on reload and rehydrates into Zustand
 * - No problem with this is that data is lost on reload & leakage of data is not possible
 */

// Todo: SECRET_KEY should be a user provided password
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY || "secret_key";
function encode(data: string) {
  return btoa(unescape(encodeURIComponent(data + SECRET_KEY)));
}
function decode(data: string) {
  return decodeURIComponent(escape(atob(data))).replace(SECRET_KEY, "");
}

export const useWalletStore = create<WalletState>()(
  devtools(
    persist(
      (set) => ({
        wallets: [],
        recovery: null,
        unlocked: false,

        // Actions
        setWallets: (wallets) => set({ wallets }),
        setRecovery: (recovery) => set({ recovery }),
        setUnlocked: (unlocked) => set({ unlocked }),
        clear: () => set({ wallets: [], recovery: null, unlocked: false }),
      }),
      {
        name: STORAGE_KEYS.ZUSTAND_STATE,
        storage: createJSONStorage(() => ({
          getItem: (key) => {
            const item = getLocalStorage<string>(key);
            if (!item) return null;
            return decode(item);
          },
          setItem: (key, value) => setLocalStorage(key, encode(value)),
          removeItem: (key) => removeLocalStorage(key),
        })),
        partialize: (state) => ({
          // Define what to persist
          wallets: state.wallets,
          recovery: state.recovery,
          unlocked: state.unlocked,
        }),
      }
    )
  )
);
