"use client";

import type { IWallet } from "@/types/types.wallet";
import { WalletCard } from "./wallet-card";
import { useMaskSecrets } from "@/hooks/use-mask-secrets";

interface WalletsListProps {
  wallets: IWallet[];
}

export function WalletsList({ wallets }: WalletsListProps) {
  const { masked } = useMaskSecrets();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {wallets.map((wallet) => (
        <WalletCard
          key={wallet.accountNumber}
          wallet={wallet}
          masked={masked}
        />
      ))}
    </div>
  );
}
