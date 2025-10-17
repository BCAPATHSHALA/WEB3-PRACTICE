// https://www.alchemy.com/docs/reference/ethereum-api-quickstart
// https://www.alchemy.com/docs/reference/solana-api-quickstart

import { ethers } from "ethers";
import { Connection, PublicKey } from "@solana/web3.js";

const ETH_MAINNET_RPC_URL = process.env.ETH_MAINNET_RPC_URL!;
const SOLANA_MAINNET_RPC_URL = process.env.SOLANA_MAINNET_RPC_URL!;

// Connect to the Ethereum & Solana mainnet with an Alchemy provider
const provider = new ethers.JsonRpcProvider(ETH_MAINNET_RPC_URL);
const connection = new Connection(SOLANA_MAINNET_RPC_URL, "confirmed");

// Example: Get balance
const getEthBalance = async (address: string) => {
  const balance = await provider.getBalance(address);
  console.log("Ethereum Balance:", ethers.formatEther(balance));
};

// Example: Get balance
const getSolBalance = async (publicKey: string) => {
  const balance = await connection.getBalance(new PublicKey(publicKey));
  console.log("Solana Balance:", balance / 1e9);
};

// Usage
getEthBalance("0x8318E7061f0dF11B0c427C65B98C1e5C6a0F4b32");
getSolBalance("9Wit2qPiT4mKN7RRShpPWTsVcdaT2Zkh3hdyTcnRCx8F");
