import { z } from "zod";

// Password validation schema
export const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  hint: z.string().optional(),
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

// Confirm password schema
export const confirmPasswordSchema = passwordSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ConfirmPasswordFormData = z.infer<typeof confirmPasswordSchema>;

// Unlock schema
export const unlockSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export type UnlockFormData = z.infer<typeof unlockSchema>;

// Mnemonic import schema
export const mnemonicSchema = z
  .object({
    mnemonic: z
      .string()
      .min(1, "Recovery phrase is required")
      .refine((val) => {
        const words = val.trim().split(/\s+/);
        return words.length === 12 || words.length === 24;
      }, "Recovery phrase must be 12 or 24 words"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    hint: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type MnemonicFormData = z.infer<typeof mnemonicSchema>;

// Change password schema
export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Add wallet schema
const blockchainEnum = ["60", "501"] as const;

export const addWalletSchema = z.object({
  coinType: z.enum(blockchainEnum, {
    message: "Please select a blockchain",
  }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
});

export type AddWalletFormData = z.infer<typeof addWalletSchema>;

export const deleteWalletSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),
  confirmation: z.literal(true, {
    message: "You must confirm wallet deletion",
  }),
});

export type DeleteWalletInput = z.infer<typeof deleteWalletSchema>;
