"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/wallet.schema";
import {
  changePassword,
  wipeAllAndShowOnboarding,
} from "@/utils/wallet.flows.util";
import { useWalletAuth } from "@/hooks/use-wallet-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const { logout } = useWalletAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isWiping, setIsWiping] = useState(false);

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      const result = await changePassword(data.oldPassword, data.newPassword);
      if (result.success) {
        toast.success(result.message);
        form.reset();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to change password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleWipeWallet = async () => {
    try {
      setIsWiping(true);
      const result = await wipeAllAndShowOnboarding();
      if (result.success) {
        toast.success("Wallet wiped successfully");
        await logout();
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to wipe wallet");
    } finally {
      setIsWiping(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your wallet security and password
        </p>
      </div>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>Update your wallet password</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your current password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a new password"
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
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm your new password"
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
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>
            Irreversible actions that will affect your wallet
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-destructive bg-destructive/10">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              These actions cannot be undone. Make sure you have backed up your
              recovery phrase before proceeding.
            </AlertDescription>
          </Alert>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="h-4 w-4 mr-2" />
                Wipe All Wallets
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Wipe All Wallets?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all wallets and data from this
                  device. This action cannot be undone. Make sure you have your
                  recovery phrase saved.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogAction
                onClick={handleWipeWallet}
                disabled={isWiping}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isWiping ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Wiping...
                  </>
                ) : (
                  "Wipe Everything"
                )}
              </AlertDialogAction>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
