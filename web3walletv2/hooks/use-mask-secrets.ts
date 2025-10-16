"use client";

import { STORAGE_KEYS } from "@/utils/constants.util";
import { getLocalStorage, setLocalStorage } from "@/utils/local.storage.util";
import { useEffect, useState } from "react";

export function useMaskSecrets() {
  const [masked, setMasked] = useState<boolean>(true);

  useEffect(() => {
    try {
      const value = getLocalStorage(STORAGE_KEYS.MASK_SECRETS_DEFAULT);
      if (value != null) {
        setMasked(value === "true");
      }
    } catch {}
  }, []);

  const update = (next: boolean) => {
    setMasked(next);
    try {
      setLocalStorage(STORAGE_KEYS.MASK_SECRETS_DEFAULT, String(next));
    } catch {}
  };

  return { masked, setMasked: update };
}
