"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  unlockSchema,
  type UnlockFormData,
} from "@/lib/validations/wallet.schema";
import { unlockWithPassword } from "@/utils/wallet.flows.util";
import { useWalletStore } from "@/store/use.wallet.store";
import { getLocalStorage } from "@/utils/local.storage.util";
import { STORAGE_KEYS } from "@/utils/constants.util";
import type { IPasswordMeta } from "@/types/types.wallet";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export const UnlockWallet = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { setUnlocked } = useWalletStore();

  const meta = getLocalStorage<IPasswordMeta>(STORAGE_KEYS.PASSWORD_KEY);
  const passwordHint = meta?.hint;

  const form = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: UnlockFormData) => {
    try {
      setIsLoading(true);
      const result = await unlockWithPassword(data.password);
      if (result.success) {
        toast.success(result.message);
        setUnlocked(true);
        document.cookie = "wallet_unlocked=true; path=/; max-age=2592000";
        router.push("/wallet");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to unlock wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="w-full flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Unlock Wallet</h1>
          <p className="text-muted-foreground">
            Enter your password to access your wallets
          </p>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    {passwordHint && (
                      <FormDescription>Hint: {passwordHint}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Unlocking...
                  </>
                ) : (
                  "Unlock Wallet"
                )}
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </main>
  );
};
