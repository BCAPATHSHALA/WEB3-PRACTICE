"use client";

import { useParams } from "next/navigation";
import { useWalletStore } from "@/store/use.wallet.store";
import { onGetWallet } from "@/utils/wallet.flows.util";
import type { IWallet } from "@/types/types.wallet";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Eye,
  EyeOff,
  ArrowLeft,
  ExternalLink,
  Send,
  Download,
  Trash2,
  QrCode,
} from "lucide-react";
import { SiSolana } from "react-icons/si";
import { FaEthereum } from "react-icons/fa";
import { toast } from "sonner";
import Link from "next/link";
import { SendTransactionDialog } from "../_components/send-transaction-dialog";
import { ReceiveTransactionSheet } from "../_components/receive-transaction-sheet";
import { DeleteWalletDialog } from "../_components/delete-wallet-dialog";
import { WalletStats } from "../_components/wallet-stats";

export default function WalletDetailPage() {
  const params = useParams();
  const accountNumber = params.accountNumber as string;
  const { wallets } = useWalletStore();
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [receiveOpen, setReceiveOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const foundWallet = onGetWallet(accountNumber, "accountNumber");
    setWallet(foundWallet);
  }, [accountNumber, wallets]);

  if (!wallet) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-muted-foreground mb-4">Wallet not found</p>
        <Button asChild>
          <Link href="/wallet">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wallets
          </Link>
        </Button>
      </div>
    );
  }

  const isSolana = wallet.coinType === "501";
  const coinLabel = isSolana ? "Solana" : "Ethereum";
  const CoinIcon = isSolana ? SiSolana : FaEthereum;
  const explorerUrl = isSolana
    ? `https://solscan.io/account/${wallet.publicKey}`
    : `https://etherscan.io/address/${wallet.publicKey}`;

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const truncateAddress = (address: string, chars = 8) => {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/wallet">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <CoinIcon
                className={`h-6 w-6 ${
                  isSolana ? "text-[#14F195]" : "text-[#627EEA]"
                }`}
              />
              <h1 className="text-3xl font-bold">{coinLabel} Wallet</h1>
            </div>
            <p className="text-muted-foreground mt-1">
              {truncateAddress(wallet.accountNumber)}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="text-base px-3 py-1">
          {coinLabel}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          onClick={() => setReceiveOpen(true)}
          variant="outline"
          className="gap-2"
        >
          <QrCode className="h-4 w-4" />
          Receive
        </Button>
        <Button onClick={() => setSendOpen(true)} className="gap-2">
          <Send className="h-4 w-4" />
          Send
        </Button>
        <Button
          onClick={() => setDeleteOpen(true)}
          variant="destructive"
          className="gap-2 ml-auto"
        >
          <Trash2 className="h-4 w-4" />
          Delete Wallet
        </Button>
      </div>

      {/* Wallet Stats */}
      <WalletStats wallet={wallet} />

      {/* Main Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">Keys</TabsTrigger>
          <TabsTrigger value="info">Information</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Public Address</CardTitle>
              <CardDescription>
                Share this address to receive funds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
                {wallet.publicKey}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    copy(wallet.publicKey, "Public address copied")
                  }
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Address
                </Button>
                <Button
                  variant="outline"
                  asChild
                  className="flex-1 bg-transparent"
                >
                  <a href={explorerUrl} target="_blank" rel="noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Explorer
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Wallet Statistics</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Derivation Path</p>
                <p className="font-mono text-sm mt-1">{wallet.path}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Wallet Index</p>
                <p className="font-mono text-sm mt-1">{wallet.index}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Wallets</p>
                <p className="font-mono text-sm mt-1">
                  {wallet.walletCount.total}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coin Type</p>
                <p className="font-mono text-sm mt-1">{wallet.coinType}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keys Tab */}
        <TabsContent value="keys" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Private Key</CardTitle>
              <CardDescription>
                Keep this secret. Never share it with anyone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
                {isRevealed ? wallet.privateKey : "••••••••••••••••••••••••••"}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsRevealed(!isRevealed)}
                  className="flex-1"
                >
                  {isRevealed ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Reveal
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => copy(wallet.privateKey, "Private key copied")}
                  className="flex-1"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Derived Seed</CardTitle>
              <CardDescription>
                The seed used to derive this wallet
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
                {wallet.derivedSeed}
              </div>
              <Button
                onClick={() => copy(wallet.derivedSeed, "Derived seed copied")}
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Seed
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Information Tab */}
        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Account Number
                </label>
                <p className="font-mono text-sm mt-1 break-all">
                  {wallet.accountNumber}
                </p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Derivation Path
                </label>
                <p className="font-mono text-sm mt-1">{wallet.path}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Blockchain
                </label>
                <p className="text-sm mt-1">{coinLabel}</p>
              </div>
              <Separator />
              <div>
                <label className="text-sm font-semibold text-muted-foreground">
                  Wallet Count
                </label>
                <div className="text-sm mt-1 space-y-1">
                  <p>Total: {wallet.walletCount.total}</p>
                  <p>Solana: {wallet.walletCount.solana}</p>
                  <p>Ethereum: {wallet.walletCount.ethereum}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                <p className="text-blue-900 dark:text-blue-100">
                  This wallet is derived from your master recovery phrase using
                  BIP-44 standard derivation paths.
                </p>
              </div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
                <p className="text-amber-900 dark:text-amber-100">
                  Your private key is encrypted and stored locally. Never share
                  it with anyone.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs and Sheets */}
      {wallet && (
        <>
          <SendTransactionDialog
            open={sendOpen}
            onOpenChange={setSendOpen}
            wallet={wallet}
            balance={balance}
          />
          <ReceiveTransactionSheet
            open={receiveOpen}
            onOpenChange={setReceiveOpen}
            wallet={wallet}
          />
          <DeleteWalletDialog
            open={deleteOpen}
            onOpenChange={setDeleteOpen}
            wallet={wallet}
          />
        </>
      )}
    </div>
  );
}

// "use client";

// import { useParams } from "next/navigation";
// import { useWalletStore } from "@/store/use.wallet.store";
// import { onGetWallet } from "@/utils/wallet.flows.util";
// import type { IWallet } from "@/types/types.wallet";
// import { useEffect, useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Copy, Eye, EyeOff, ArrowLeft, ExternalLink } from "lucide-react";
// import { SiSolana } from "react-icons/si";
// import { FaEthereum } from "react-icons/fa";
// import { toast } from "sonner";
// import Link from "next/link";

// export default function WalletDetailPage() {
//   const params = useParams();
//   const accountNumber = params.accountNumber as string;
//   const { wallets } = useWalletStore();
//   const [wallet, setWallet] = useState<IWallet | null>(null);
//   const [isRevealed, setIsRevealed] = useState(false);

//   useEffect(() => {
//     const foundWallet = onGetWallet(accountNumber, "accountNumber");
//     setWallet(foundWallet);
//   }, [accountNumber, wallets]);

//   if (!wallet) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <p className="text-muted-foreground mb-4">Wallet not found</p>
//         <Button asChild>
//           <Link href="/wallet">
//             <ArrowLeft className="h-4 w-4 mr-2" />
//             Back to Wallets
//           </Link>
//         </Button>
//       </div>
//     );
//   }

//   const isSolana = wallet.coinType === "501";
//   const coinLabel = isSolana ? "Solana" : "Ethereum";
//   const CoinIcon = isSolana ? SiSolana : FaEthereum;
//   const explorerUrl = isSolana
//     ? `https://solscan.io/account/${wallet.publicKey}`
//     : `https://etherscan.io/address/${wallet.publicKey}`;

//   const copy = async (text: string, label: string) => {
//     try {
//       await navigator.clipboard.writeText(text);
//       toast.success(label);
//     } catch {
//       toast.error("Failed to copy");
//     }
//   };

//   const truncateAddress = (address: string, chars = 8) => {
//     return `${address.slice(0, chars)}...${address.slice(-chars)}`;
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-4">
//           <Button variant="outline" size="icon" asChild>
//             <Link href="/wallet">
//               <ArrowLeft className="h-4 w-4" />
//             </Link>
//           </Button>
//           <div>
//             <div className="flex items-center gap-2">
//               <CoinIcon
//                 className={`h-6 w-6 ${
//                   isSolana ? "text-[#14F195]" : "text-[#627EEA]"
//                 }`}
//               />
//               <h1 className="text-3xl font-bold">{coinLabel} Wallet</h1>
//             </div>
//             <p className="text-muted-foreground mt-1">
//               {truncateAddress(wallet.accountNumber)}
//             </p>
//           </div>
//         </div>
//         <Badge variant="outline" className="text-base px-3 py-1">
//           {coinLabel}
//         </Badge>
//       </div>

//       {/* Main Content */}
//       <Tabs defaultValue="overview" className="w-full">
//         <TabsList className="grid w-full grid-cols-3">
//           <TabsTrigger value="overview">Overview</TabsTrigger>
//           <TabsTrigger value="keys">Keys</TabsTrigger>
//           <TabsTrigger value="info">Information</TabsTrigger>
//         </TabsList>

//         {/* Overview Tab */}
//         <TabsContent value="overview" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Public Address</CardTitle>
//               <CardDescription>
//                 Share this address to receive funds
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
//                 {wallet.publicKey}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   onClick={() =>
//                     copy(wallet.publicKey, "Public address copied")
//                   }
//                   className="flex-1"
//                 >
//                   <Copy className="h-4 w-4 mr-2" />
//                   Copy Address
//                 </Button>
//                 <Button
//                   variant="outline"
//                   asChild
//                   className="flex-1 bg-transparent"
//                 >
//                   <a href={explorerUrl} target="_blank" rel="noreferrer">
//                     <ExternalLink className="h-4 w-4 mr-2" />
//                     View on Explorer
//                   </a>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Wallet Statistics</CardTitle>
//             </CardHeader>
//             <CardContent className="grid grid-cols-2 gap-4">
//               <div>
//                 <p className="text-sm text-muted-foreground">Derivation Path</p>
//                 <p className="font-mono text-sm mt-1">{wallet.path}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Wallet Index</p>
//                 <p className="font-mono text-sm mt-1">{wallet.index}</p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Total Wallets</p>
//                 <p className="font-mono text-sm mt-1">
//                   {wallet.walletCount.total}
//                 </p>
//               </div>
//               <div>
//                 <p className="text-sm text-muted-foreground">Coin Type</p>
//                 <p className="font-mono text-sm mt-1">{wallet.coinType}</p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Keys Tab */}
//         <TabsContent value="keys" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Private Key</CardTitle>
//               <CardDescription>
//                 Keep this secret. Never share it with anyone.
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
//                 {isRevealed ? wallet.privateKey : "••••••••••••••••••••••••••"}
//               </div>
//               <div className="flex gap-2">
//                 <Button
//                   variant="outline"
//                   onClick={() => setIsRevealed(!isRevealed)}
//                   className="flex-1"
//                 >
//                   {isRevealed ? (
//                     <>
//                       <EyeOff className="h-4 w-4 mr-2" />
//                       Hide
//                     </>
//                   ) : (
//                     <>
//                       <Eye className="h-4 w-4 mr-2" />
//                       Reveal
//                     </>
//                   )}
//                 </Button>
//                 <Button
//                   onClick={() => copy(wallet.privateKey, "Private key copied")}
//                   className="flex-1"
//                 >
//                   <Copy className="h-4 w-4 mr-2" />
//                   Copy
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Derived Seed</CardTitle>
//               <CardDescription>
//                 The seed used to derive this wallet
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="p-4 bg-muted rounded-lg break-all font-mono text-sm">
//                 {wallet.derivedSeed}
//               </div>
//               <Button
//                 onClick={() => copy(wallet.derivedSeed, "Derived seed copied")}
//                 className="w-full"
//               >
//                 <Copy className="h-4 w-4 mr-2" />
//                 Copy Seed
//               </Button>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Information Tab */}
//         <TabsContent value="info" className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Wallet Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div>
//                 <label className="text-sm font-semibold text-muted-foreground">
//                   Account Number
//                 </label>
//                 <p className="font-mono text-sm mt-1 break-all">
//                   {wallet.accountNumber}
//                 </p>
//               </div>
//               <Separator />
//               <div>
//                 <label className="text-sm font-semibold text-muted-foreground">
//                   Derivation Path
//                 </label>
//                 <p className="font-mono text-sm mt-1">{wallet.path}</p>
//               </div>
//               <Separator />
//               <div>
//                 <label className="text-sm font-semibold text-muted-foreground">
//                   Blockchain
//                 </label>
//                 <p className="text-sm mt-1">{coinLabel}</p>
//               </div>
//               <Separator />
//               <div>
//                 <label className="text-sm font-semibold text-muted-foreground">
//                   Wallet Count
//                 </label>
//                 <div className="text-sm mt-1 space-y-1">
//                   <p>Total: {wallet.walletCount.total}</p>
//                   <p>Solana: {wallet.walletCount.solana}</p>
//                   <p>Ethereum: {wallet.walletCount.ethereum}</p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Security Information</CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-3 text-sm">
//               <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
//                 <p className="text-blue-900 dark:text-blue-100">
//                   This wallet is derived from your master recovery phrase using
//                   BIP-44 standard derivation paths.
//                 </p>
//               </div>
//               <div className="p-3 bg-amber-50 dark:bg-amber-950 rounded border border-amber-200 dark:border-amber-800">
//                 <p className="text-amber-900 dark:text-amber-100">
//                   Your private key is encrypted and stored locally. Never share
//                   it with anyone.
//                 </p>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }
