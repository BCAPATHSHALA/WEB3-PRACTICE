import axios from "axios";

const ETH_MAINNET_RPC_URL = process.env.ETH_MAINNET_RPC_URL!;
const SOLANA_MAINNET_RPC_URL = process.env.SOLANA_MAINNET_RPC_URL!;

// Connect to the Ethereum & Solana mainnet with an Alchemy provider
const main = async (RPC_URL: string, payload: any) => {
  const response = axios
    .post(RPC_URL, payload)
    .then((response) => {
      console.log("Alchemy Response:", response.data);
    })
    .catch((error) => {
      console.error("Alchemy Error:", error);
    });
};

// Retrieve account details for a specific address
main(ETH_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "eth_getAccount",
  params: ["0x8318E7061f0dF11B0c427C65B98C1e5C6a0F4b32", "latest"],
  id: 1,
});

main(SOLANA_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "getAccountInfo",
  params: ["9Wit2qPiT4mKN7RRShpPWTsVcdaT2Zkh3hdyTcnRCx8F"],
  id: 1,
});

// Get the balance of a specific address
main(ETH_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "eth_getBalance",
  params: ["0x8318E7061f0dF11B0c427C65B98C1e5C6a0F4b32", "latest"],
  id: 1,
});

main(SOLANA_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "getBalance",
  params: ["9Wit2qPiT4mKN7RRShpPWTsVcdaT2Zkh3hdyTcnRCx8F"],
  id: 1,
});

// Get the transaction count of a specific address
main(ETH_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "eth_getTransactionCount",
  params: ["0x8318E7061f0dF11B0c427C65B98C1e5C6a0F4b32", "latest"],
  id: 1,
});

main(SOLANA_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "getTransactionCount",
  params: [],
  id: 1,
});

// Return information about a block by number or tag
main(ETH_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "eth_getBlockByNumber",
  params: ["latest", false],
  id: 1,
});

main(SOLANA_MAINNET_RPC_URL, {
  jsonrpc: "2.0",
  method: "getBlock",
  params: ["finalized"],
  id: 1,
});
