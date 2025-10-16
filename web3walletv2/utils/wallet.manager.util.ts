import { IWallet } from "@/types/types.wallet";
import { derivePath } from "ed25519-hd-key";
import { v4 as uuidv4 } from "uuid";
import nacl from "tweetnacl";
import { ethers } from "ethers";
import bs58 from "bs58";

// Generate a new wallet based on the master seed phrase and coin type
const generateWalletFromSeed = (
  masterSeedPhrase: string,
  coinType: string,
  index: number,
  totalWallets?: number
): IWallet => {
  const accountNumber = uuidv4();

  let path: string;
  let privateKey: string;
  let publicKey: string;
  let derivedSeed: Buffer;
  let solanaWalletCount = 0;
  let ethereumWalletCount = 0;

  if (coinType === "501") {
    // SOLANA COIN
    path = `m/44'/${coinType}'/${index}'/0'`;
    const derived = derivePath(path, masterSeedPhrase);
    derivedSeed = derived.key;
    const keypair = nacl.sign.keyPair.fromSeed(derivedSeed); // Solana wallets use ed25519 derivation
    const secrete = keypair.secretKey;
    const address = keypair.publicKey;
    const secretKeyEncoded = bs58.encode(secrete);
    const publicKeyEncoded = bs58.encode(address);
    privateKey = secretKeyEncoded;
    publicKey = publicKeyEncoded;
    // Set the solanaWalletCount in the walletCount object
    solanaWalletCount = index === 0 ? 1 : index;
  } else if (coinType === "60") {
    // ETHEREUM COIN
    path = `m/44'/${coinType}'/0'/0/${index}`;
    const wallet = ethers.HDNodeWallet.fromSeed(
      Buffer.from(masterSeedPhrase, "hex")
    ).derivePath(path); // Ethereum wallets use secp256k1 derivation
    const secret = wallet.privateKey;
    const address = wallet.address;
    privateKey = secret;
    publicKey = address;
    derivedSeed = Buffer.from(secret.replace("0x", ""), "hex");
    // Set the ethereumWalletCount in the walletCount object
    ethereumWalletCount = index === 0 ? 1 : index;
  } else {
    throw new Error("Unsupported coin type");
  }

  // Set the totalWallets in the walletCount object
  // If totalWallets is undefined or zero, set it to 1; otherwise increment by 1
  if (typeof totalWallets !== "number") {
    totalWallets = 1;
  } else {
    totalWallets = totalWallets === 0 ? 1 : totalWallets + 1;
  }

  return {
    path,
    derivedSeed: derivedSeed.toString("hex"),
    privateKey,
    publicKey,
    coinType,
    accountNumber,
    index,
    walletCount: {
      total: totalWallets ?? 0,
      solana: solanaWalletCount,
      ethereum: ethereumWalletCount,
    },
  };
};

export { generateWalletFromSeed };
