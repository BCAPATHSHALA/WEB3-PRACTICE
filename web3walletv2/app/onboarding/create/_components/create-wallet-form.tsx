"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  passwordSchema,
  type PasswordFormData,
} from "@/lib/validations/wallet.schema";
import {
  startCreateFlow,
  finalizeCreateWithPassword,
} from "@/utils/wallet.flows.util";
import { useWalletStore } from "@/store/use.wallet.store";
import { Button } from "@/components/ui/button";
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
import { Loader2 } from "lucide-react";
import { COOKIE_KEYS } from "@/utils/constants.util";

interface CreateWalletFormProps {
  onRecoveryGenerated?: (phrase: string) => void;
  recoveryPhrase?: string;
  isPasswordStep?: boolean;
  onWalletCreated?: () => void;
}

export function CreateWalletForm({
  onRecoveryGenerated,
  recoveryPhrase,
  isPasswordStep,
  onWalletCreated,
}: CreateWalletFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      hint: "",
    },
  });

  const handleGenerateRecovery = async () => {
    try {
      setIsLoading(true);
      const phrase = startCreateFlow();
      onRecoveryGenerated?.(phrase.mnemonicPhrase);
      toast.success("Recovery phrase generated successfully");
    } catch (error) {
      toast.error("Failed to generate recovery phrase");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      setIsLoading(true);
      const result = await finalizeCreateWithPassword(data.password, data.hint);
      if (result.success) {
        toast.success(result.message);
        // Set cookie to mark wallet as unlocked for session persistence and vault existence check in middleware (30 days)
        document.cookie = `${COOKIE_KEYS.IS_UNLOCKED}=true; path=/; max-age=2592000`;
        document.cookie = `${COOKIE_KEYS.HAS_VAULT}=true; path=/; max-age=2592000`;
        onWalletCreated?.();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create wallet");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isPasswordStep) {
    return (
      <div className="space-y-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            A recovery phrase is a series of 12 words that can be used to
            recover your wallet. Keep it safe and never share it with anyone.
          </p>
        </div>
        <Button
          onClick={handleGenerateRecovery}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Recovery Phrase"
          )}
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Create Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter a strong password"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Must contain uppercase, number, and special character
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="hint"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password Hint (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., My favorite color and year"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A hint to help you remember your password
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading} className="w-full" size="lg">
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Wallet...
            </>
          ) : (
            "Create Wallet"
          )}
        </Button>
      </form>
    </Form>
  );
}
