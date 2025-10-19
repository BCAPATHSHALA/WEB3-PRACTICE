/**
 * Ethereum RPC utils - https://ethereum.org/en/developers/docs/apis/json-rpc/
 * Alchemy Docs: https://www.alchemy.com/docs/reference/ethereum-api-quickstart
 */

import axios from "axios";

const ETH_RPC_URL =
  process.env.NEXT_PUBLIC_ETH_RPC_URL ||
  "https://eth-mainnet.g.alchemy.com/v2/demo";

interface RpcResponse<T = any> {
  jsonrpc: string;
  id: number;
  result?: T;
  error?: { code: number; message: string };
}

export interface EthereumBalance {
  value: string; // wei as decimal string (e.g. "1000000000000000000")
  decimals: number;
  uiAmount: number; // floating ETH
}

export interface EthereumBlockInfo {
  number: string;
  hash: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  miner: string;
}

function hexToBigInt(hex?: string): bigint {
  if (!hex) return BigInt(0);
  return BigInt(hex);
}

function hexToNumber(hex?: string): number {
  if (!hex) return 0;
  return Number.parseInt(hex, 16);
}

// Make RPC call to Ethereum node
async function makeRpcCall<T = any>(
  method: string,
  params: any[] = []
): Promise<T> {
  const payload = { jsonrpc: "2.0", method, params, id: Date.now() };
  try {
    const { data } = await axios.post<RpcResponse<T>>(ETH_RPC_URL, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });
    if (data.error) throw new Error(data.error.message);
    return data.result as T;
  } catch (err: any) {
    console.error(`[Ethereum RPC] ${method} failed:`, err?.message || err);
    throw err;
  }
}

// Get balance (wei hex -> convert)
export const getEthereumBalance = async (
  address: string
): Promise<EthereumBalance> => {
  const balanceHex = await makeRpcCall<string>("eth_getBalance", [
    address,
    "latest",
  ]);
  const balanceWei = hexToBigInt(balanceHex);
  // convert to decimal string
  const uiAmount = Number(balanceWei) / 1e18;
  return {
    value: balanceWei.toString(),
    decimals: 18,
    uiAmount,
  };
};

// Account info: nonce and whether it's a contract
export const getEthereumAccountInfo = async (address: string) => {
  const nonceHex = await makeRpcCall<string>("eth_getTransactionCount", [
    address,
    "latest",
  ]);
  const code = await makeRpcCall<string>("eth_getCode", [address, "latest"]);
  return {
    address,
    nonce: hexToNumber(nonceHex),
    isContract: code && code !== "0x",
    codeSize: code ? Math.max(0, code.length / 2 - 1) : 0,
  };
};

// Get transaction count (alias of getTransactionCount)
export const getEthereumTransactionCount = async (
  address: string
): Promise<number> => {
  const nonceHex = await makeRpcCall<string>("eth_getTransactionCount", [
    address,
    "latest",
  ]);
  return hexToNumber(nonceHex);
};

// Get latest block info
export const getEthereumLatestBlock = async (): Promise<EthereumBlockInfo> => {
  const block = await makeRpcCall<any>("eth_getBlockByNumber", [
    "latest",
    false,
  ]);
  return {
    number: hexToNumber(block?.number).toString(),
    hash: block?.hash || "",
    timestamp: new Date(hexToNumber(block?.timestamp) * 1000).toISOString(),
    gasUsed: hexToNumber(block?.gasUsed).toString(),
    gasLimit: hexToNumber(block?.gasLimit).toString(),
    miner: block?.miner || "",
  };
};

// Get current gas price
export const getEthereumGasPrice = async (): Promise<{
  wei: string;
  gwei: number;
}> => {
  const gasHex = await makeRpcCall<string>("eth_gasPrice", []);
  const gasWei = hexToBigInt(gasHex);
  const gwei = Number(gasWei) / 1e9;
  return { wei: gasWei.toString(), gwei };
};

// Estimate gas for a transaction object
export const estimateEthereumGas = async (tx: {
  from: string;
  to?: string;
  value?: string;
  data?: string;
}): Promise<number> => {
  const gasHex = await makeRpcCall<string>("eth_estimateGas", [tx]);
  return hexToNumber(gasHex);
};
