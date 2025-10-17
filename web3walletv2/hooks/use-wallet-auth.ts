"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWalletStore } from "@/store/use.wallet.store";
import { getLocalStorage } from "@/utils/local.storage.util";
import { COOKIE_KEYS, STORAGE_KEYS } from "@/utils/constants.util";
import type { IPasswordMeta } from "@/types/types.wallet";

export function useWalletAuth() {
  const router = useRouter();
  const { unlocked, setUnlocked } = useWalletStore();
  const [isLoading, setIsLoading] = useState(true);
  const [hasVault, setHasVault] = useState(false);

  // Check if vault exists on mount
  useEffect(() => {
    const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
    setHasVault(!!meta);
    setIsLoading(false);
  }, []);

  const logout = useCallback(async () => {
    setUnlocked(false);
    document.cookie = `${COOKIE_KEYS.IS_UNLOCKED}=; path=/; max-age=0`;
    document.cookie = `${COOKIE_KEYS.HAS_VAULT}=; path=/; max-age=0`;
    router.push("/onboarding/unlock");
  }, [setUnlocked, router]);

  const resetWallet = useCallback(async () => {
    setUnlocked(false);
    document.cookie = `${COOKIE_KEYS.IS_UNLOCKED}=; path=/; max-age=0`;
    document.cookie = `${COOKIE_KEYS.HAS_VAULT}=; path=/; max-age=0`;
    router.push("/");
  }, [setUnlocked, router]);

  return {
    isUnlocked: unlocked,
    hasVault,
    isLoading,
    logout,
    resetWallet,
  };
}
