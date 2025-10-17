"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  unlockSchema,
  type UnlockFormData,
} from "@/lib/validations/wallet.schema";
import { onGetRecoveryPhrase } from "@/utils/wallet.flows.util";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Copy, Eye, EyeOff, AlertTriangle, Loader2 } from "lucide-react";

export default function RecoverySettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);

  const form = useForm<UnlockFormData>({
    resolver: zodResolver(unlockSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (data: UnlockFormData) => {
    try {
      setIsLoading(true);
      const phrase = await onGetRecoveryPhrase(data.password);
      if (phrase) {
        setRecoveryPhrase(phrase.mnemonicPhrase);
        toast.success("Recovery phrase retrieved");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to retrieve recovery phrase");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    if (recoveryPhrase) {
      navigator.clipboard.writeText(recoveryPhrase);
      toast.success("Recovery phrase copied to clipboard");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Recovery Phrase</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your secret recovery phrase
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950 dark:border-amber-800">
        <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-900 dark:text-amber-100">
          Your recovery phrase is the master key to your wallets. Never share it
          with anyone. Store it in a safe place.
        </AlertDescription>
      </Alert>

      {!recoveryPhrase ? (
        <Card>
          <CardHeader>
            <CardTitle>Unlock Recovery Phrase</CardTitle>
            <CardDescription>
              Enter your password to view your recovery phrase
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Unlocking...
                    </>
                  ) : (
                    "View Recovery Phrase"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Recovery Phrase</CardTitle>
            <CardDescription>Keep this phrase safe and secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold">Recovery Phrase</label>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setRevealed(!revealed)}
                >
                  {revealed ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show
                    </>
                  )}
                </Button>
              </div>
              <Textarea
                value={revealed ? recoveryPhrase : "••••••••••••••••••••••••••"}
                readOnly
                className="font-mono text-sm min-h-24"
              />
            </div>
            <Button onClick={handleCopy} className="w-full">
              <Copy className="h-4 w-4 mr-2" />
              Copy Recovery Phrase
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setRecoveryPhrase(null);
                form.reset();
              }}
              className="w-full"
            >
              Hide Recovery Phrase
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
