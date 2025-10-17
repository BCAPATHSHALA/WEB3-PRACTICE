"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onAddWallet } from "@/utils/wallet.flows.util";
import { useWalletStore } from "@/store/use.wallet.store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import {
  AddWalletFormData,
  addWalletSchema,
} from "@/lib/validations/wallet.schema";

export function AddWalletDialog() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddWalletFormData>({
    resolver: zodResolver(addWalletSchema),
    defaultValues: {
      coinType: "60",
      password: "",
    },
  });

  const onSubmit = async (data: AddWalletFormData) => {
    try {
      setIsLoading(true);
      const result = await onAddWallet(data.password, data.coinType);
      if (result.success) {
        toast.success(result.message);
        form.reset();
        setOpen(false);
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to add wallet");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Wallet
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Wallet</DialogTitle>
          <DialogDescription>
            Create a new wallet for Solana or Ethereum
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="coinType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a blockchain" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="60">Ethereum</SelectItem>
                      <SelectItem value="501">Solana</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose which blockchain to create a wallet for
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your wallet password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Confirm your password to add a new wallet
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Wallet"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
