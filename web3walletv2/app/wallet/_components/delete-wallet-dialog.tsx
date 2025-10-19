"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { onDeleteWallet } from "@/utils/wallet.flows.util";
import { useWalletStore } from "@/store/use.wallet.store";
import { useRouter } from "next/navigation";
import type { IWallet } from "@/types/types.wallet";
import {
  DeleteWalletInput,
  deleteWalletSchema,
} from "@/lib/validations/wallet.schema";

interface DeleteWalletDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: IWallet;
}

export function DeleteWalletDialog({
  open,
  onOpenChange,
  wallet,
}: DeleteWalletDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setWallets } = useWalletStore();

  const form = useForm<DeleteWalletInput>({
    resolver: zodResolver(deleteWalletSchema),
    defaultValues: {
      password: "",
      confirmation: true,
    },
  });

  const onSubmit = async (data: DeleteWalletInput) => {
    try {
      setIsLoading(true);

      // Call the delete wallet utility
      const result = await onDeleteWallet(wallet.accountNumber, data.password);

      if (result.success) {
        toast.success("Wallet deleted successfully");
        form.reset();
        onOpenChange(false);

        // Update store and redirect
        const { wallets } = useWalletStore.getState();
        setWallets(
          wallets.filter((w) => w.accountNumber !== wallet.accountNumber)
        );

        router.push("/wallet");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Wallet
          </DialogTitle>
          <DialogDescription>This action cannot be undone</DialogDescription>
        </DialogHeader>

        {/* Warning Alert */}
        <Alert className="border-red-200 bg-red-50 dark:bg-red-950">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Deleting this wallet will permanently remove it from your vault.
            Make sure you have backed up your recovery phrase before proceeding.
          </AlertDescription>
        </Alert>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Wallet Info */}
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-1">Wallet to Delete</p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {wallet.publicKey}
              </p>
            </div>

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password to confirm"
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirmation Checkbox */}
            <FormField
              control={form.control}
              name="confirmation"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      disabled={isLoading}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    I understand this wallet will be permanently deleted
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-600 hover:bg-red-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Wallet
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
