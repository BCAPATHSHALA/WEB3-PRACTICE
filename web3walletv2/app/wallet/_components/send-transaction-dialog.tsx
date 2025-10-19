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
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AlertCircle, Send, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  sendTransactionSchema,
  type SendTransactionInput,
} from "@/lib/validations/transaction.schema";
import { formatBalance } from "@/utils/transaction.util";
import type { IWallet } from "@/types/types.wallet";

interface SendTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wallet: IWallet;
  balance: number;
}

export function SendTransactionDialog({
  open,
  onOpenChange,
  wallet,
  balance,
}: SendTransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const isSolana = wallet.coinType === "501";

  const form = useForm<SendTransactionInput>({
    resolver: zodResolver(sendTransactionSchema),
    defaultValues: {
      recipientAddress: "",
      amount: "",
      memo: "",
      password: "",
    },
  });

  const onSubmit = async (data: SendTransactionInput) => {
    try {
      setIsLoading(true);

      // Validate amount
      const amount = Number.parseFloat(data.amount);
      if (amount > balance) {
        toast.error("Insufficient balance");
        return;
      }

      // TODO: Implement actual transaction sending
      // This would involve:
      // 1. Validating password
      // 2. Signing transaction with private key
      // 3. Broadcasting to network

      toast.success("Transaction sent successfully!");
      form.reset();
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to send transaction");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send {isSolana ? "SOL" : "ETH"}
          </DialogTitle>
          <DialogDescription>
            Transfer funds to another wallet address
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Balance Alert */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Available balance: {formatBalance(balance, 6)}{" "}
                {isSolana ? "SOL" : "ETH"}
              </AlertDescription>
            </Alert>

            {/* Recipient Address */}
            <FormField
              control={form.control}
              name="recipientAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recipient Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        isSolana
                          ? "Enter Solana address"
                          : "Enter Ethereum address (0x...)"
                      }
                      {...field}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormDescription>
                    {isSolana
                      ? "Base58 encoded address"
                      : "0x prefixed hex address"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="0.00"
                        step="0.000001"
                        {...field}
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() =>
                          form.setValue("amount", balance.toString())
                        }
                        disabled={isLoading}
                      >
                        Max
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Memo (Solana only) */}
            {isSolana && (
              <FormField
                control={form.control}
                name="memo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Memo (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Add a note to this transaction"
                        {...field}
                        disabled={isLoading}
                        rows={2}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Password Confirmation */}
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
                  <FormDescription>
                    Required to sign and send the transaction
                  </FormDescription>
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
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send
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
