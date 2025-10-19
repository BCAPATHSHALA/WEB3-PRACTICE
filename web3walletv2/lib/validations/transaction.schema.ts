import { PublicKey } from "@solana/web3.js";
import { z } from "zod";

export const sendTransactionSchema = z.object({
  recipientAddress: z
    .string()
    .min(1, "Recipient address is required")
    .refine((addr) => {
      // Check if the address is a valid Ethereum address
      const isEth = /^0x[a-fA-F0-9]{40}$/.test(addr);

      // Check if the address is a valid Solana address
      let isSol = false;
      try {
        new PublicKey(addr);
        isSol = true;
      } catch (err) {
        isSol = false;
      }

      return isEth || isSol;
    }, "Invalid recipient address"),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine(
      (val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0,
      "Amount must be greater than 0"
    ),
  memo: z.string().optional(),
  password: z.string().min(1, "Password is required to confirm transaction"),
});

export const receiveTransactionSchema = z.object({
  amount: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val || (!isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0),
      "Amount must be greater than 0"
    ),
});

export type SendTransactionInput = z.infer<typeof sendTransactionSchema>;
export type ReceiveTransactionInput = z.infer<typeof receiveTransactionSchema>;
