"use client";

import { useEffect, useState } from "react";

const KEY = "mask-secrets-default";

export function useMaskSecrets() {
  const [masked, setMasked] = useState<boolean>(true);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v != null) setMasked(v === "true");
    } catch {}
  }, []);

  const update = (next: boolean) => {
    setMasked(next);
    try {
      localStorage.setItem(KEY, String(next));
    } catch {}
  };

  return { masked, setMasked: update };
}
