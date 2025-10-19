/**
 * Solana RPC utils - https://docs.solana.com/developing/clients/jsonrpc-api
 * Alchemy Docs: https://www.alchemy.com/docs/reference/solana-api-quickstart
 */

import { Connection, PublicKey, Commitment } from "@solana/web3.js";

const SOLANA_RPC_URL =
  process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
  "https://api.mainnet-beta.solana.com";
const DEFAULT_COMMITMENT: Commitment = "confirmed";

// Initialize connection to the Solana mainnet
const connection = new Connection(SOLANA_RPC_URL, {
  commitment: DEFAULT_COMMITMENT,
});

export interface SolanaBalance {
  value: number; // lamports (1 SOL = 1e9 lamports)
  decimals: number;
  uiAmount: number; // SOL
}

export interface SolanaAccountInfo {
  address: string;
  lamports: number;
  owner: string | null;
  executable: boolean;
  rentEpoch: number;
  dataSize: number;
}

export interface SolanaBlockInfo {
  blockhash: string;
  blockHeight: number;
  blockTime: number | null;
  parentSlot: number | null;
}

// Get balance (lamports) and return UI-friendly object
export const getSolanaBalance = async (
  address: string
): Promise<SolanaBalance> => {
  try {
    const pub = new PublicKey(address);
    const lamports = await connection.getBalance(pub, DEFAULT_COMMITMENT);
    return {
      value: lamports,
      decimals: 9,
      uiAmount: lamports / 1e9,
    };
  } catch (err: any) {
    console.error("[Solana] getSolanaBalance error:", err?.message || err);
    throw new Error("Failed to fetch Solana balance.");
  }
};

// Get account info
export const getSolanaAccountInfo = async (
  address: string
): Promise<SolanaAccountInfo> => {
  try {
    const pub = new PublicKey(address);
    const info = await connection.getAccountInfo(pub, DEFAULT_COMMITMENT);
    if (!info) {
      return {
        address,
        lamports: 0,
        owner: null,
        executable: false,
        rentEpoch: 0,
        dataSize: 0,
      };
    }
    return {
      address,
      lamports: info.lamports,
      owner: info.owner?.toBase58() ?? null,
      executable: info.executable,
      rentEpoch: info.rentEpoch ?? 0,
      dataSize: info.data ? info.data.length : 0,
    };
  } catch (err: any) {
    console.error("[Solana] getSolanaAccountInfo error:", err?.message || err);
    throw new Error("Failed to fetch Solana account info.");
  }
};

// Get transaction count (by checking signatures for address)
export const getSolanaTransactionCount = async (
  address: string
): Promise<number> => {
  try {
    const pub = new PublicKey(address);
    const signatures = await connection.getSignaturesForAddress(
      pub,
      { limit: 1 },
      DEFAULT_COMMITMENT
    );
    return Array.isArray(signatures) ? signatures.length : 0;
  } catch (err: any) {
    console.error(
      "[Solana] getSolanaTransactionCount error:",
      err?.message || err
    );
    throw new Error("Failed to fetch Solana transaction count.");
  }
};

// Get latest block-ish info
export const getSolanaLatestBlock = async (): Promise<SolanaBlockInfo> => {
  try {
    const blockHeight = await connection.getBlockHeight(DEFAULT_COMMITMENT);
    let block: any = null;
    try {
      block = await connection.getBlock(blockHeight, {
        commitment: DEFAULT_COMMITMENT,
        transactionDetails: "none",
      });
    } catch (e) {
      // If getBlock fails, we still return height and nulls for other fields
      console.warn("[Solana] getBlock failed:", (e as any)?.message || e);
    }

    return {
      blockhash: block?.blockhash ?? "",
      blockHeight: blockHeight ?? 0,
      blockTime: block?.blockTime ?? null,
      parentSlot: block?.parentSlot ?? null,
    };
  } catch (err: any) {
    console.error("[Solana] getSolanaLatestBlock error:", err?.message || err);
    throw new Error("Failed to fetch latest Solana block.");
  }
};

// Get recent transactions (signatures with basic metadata)
export const getSolanaTransactions = async (address: string, limit = 10) => {
  try {
    const pub = new PublicKey(address);
    const sigs = await connection.getSignaturesForAddress(
      pub,
      { limit },
      DEFAULT_COMMITMENT
    );
    return (
      sigs.map((s) => ({
        signature: s.signature,
        slot: s.slot,
        blockTime: s.blockTime,
        err: s.err,
        memo: s.memo ?? null,
      })) || []
    );
  } catch (err: any) {
    console.error("[Solana] getSolanaTransactions error:", err?.message || err);
    throw new Error("Failed to fetch Solana transactions.");
  }
};
