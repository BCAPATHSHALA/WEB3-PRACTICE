/*
 * How to create multiple keypairs/wallets from a single mnemonic for both Solana and Ethereum using different derivation paths?
 * ----------------------------------------------------------------
 * This script demonstrates how to generate a mnemonic, derive a seed from it,
 * and then create multiple keypairs/wallets for both Solana and Ethereum using different derivation paths.
 * It uses the BIP39 standard for mnemonic generation and seed derivation,
 * and the ed25519-hd-key library for hierarchical deterministic key derivation.
 * The tweetnacl library is used for Solana keypair generation, and ethers.js is used for Ethereum wallet creation.
 */

import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import { Keypair } from "@solana/web3.js";
import { ethers } from "ethers";

// Generate a 12-word mnemonic
const mnemonic = generateMnemonic();
console.log("Generated Mnemonic:", mnemonic);

// Derive a seed from the mnemonic
const seed = mnemonicToSeedSync(mnemonic);
console.log("Derived/Master/Single Seed (hex):", seed.toString("hex"));

console.log("\n--- START FOR SOLANA ---\n");
// Generate and print the first 4 Solana keypairs derived from the seed
for (let i = 0; i < 4; i++) {
  console.log("");
  // Derivation path for Solana and derive the key
  const path = `m/44'/501'/0'/${i}'`; // Solana's derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  console.log(`Derivation Path: ${path}`);
  console.log("Derived Seed (hex):", derivedSeed.toString("hex"));

  // Create private key from the derived seed
  const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
  console.log("Private Key (hex):", Buffer.from(secret).toString("hex"));

  // Create the public key (address) from the secret key (private key)
  const address = Keypair.fromSecretKey(secret).publicKey.toBase58();
  console.log("Solana Address (Public Key):", address);
}

console.log("\n--- START FOR ETHEREUM ---\n");
// Generate and print the first 4 Ethereum wallets derived from the same seed
for (let i = 0; i < 4; i++) {
  console.log("");
  // Derivation path for Ethereum and derive the wallet
  const path = `m/44'/60'/0'/${i}'`; // Ethereum's derivation path
  const derivedSeed = derivePath(path, seed.toString("hex")).key;
  console.log(`Derivation Path: ${path}`);
  console.log("Derived Seed (hex):", derivedSeed.toString("hex"));

  // Create a wallet from the derived seed and print the private key and address
  const wallet = new ethers.Wallet(derivedSeed.toString("hex"));
  const secret = wallet.privateKey;
  const address = wallet.address;
  console.log("Private Key (hex):", secret);
  console.log("Ethereum Address (Public Key):", address);
}

/*
Output:
Generated Mnemonic: ready artist rack elite distance owner elephant search end culture use season
Derived/Master/Single Seed (hex): 484b62013b8876b9964d65385f4acdbf0ae554925376b4e0a1c26bf9c8079712ecefcb19f1e37157463219fb2d7e03a518c76d7b7ea7da55adf43e684d999d58

--- START FOR SOLANA ---


Derivation Path: m/44'/501'/0'/0'
Derived Seed (hex): 2632701c9ae9433c4b365917e3ef1f5c34f6e4ff53f9f8fe3be65b509e512cd8
Private Key (hex): 2632701c9ae9433c4b365917e3ef1f5c34f6e4ff53f9f8fe3be65b509e512cd872c132c9a50ca0a7cd7ed0737f318d1e4c41bd66270295beddee90c41054f2ad
Solana Address (Public Key): 8ixLuTUy1idfC7w4MWEQTKN8dQ5kj2uN4Wf9rYhodbcx

Derivation Path: m/44'/501'/0'/1'
Derived Seed (hex): 0dc52cf6757a654fce66bd9bb2486d1b28c14e46cb40a7a52a627c682d0bac05
Private Key (hex): 0dc52cf6757a654fce66bd9bb2486d1b28c14e46cb40a7a52a627c682d0bac05dc0560dfab47f2b23b7e0b5e39c0605b638adf9e4d4811c3c64fe6cd19af33c0
Solana Address (Public Key): FosT7V2sPYNbT4VQdquctcSf6cSLNfBKmghzSwpLa8qm

Derivation Path: m/44'/501'/0'/2'
Derived Seed (hex): c685fc9141a3b54e6b8897778da17dca8cfd24923903b02c81a0afd0904de466
Private Key (hex): c685fc9141a3b54e6b8897778da17dca8cfd24923903b02c81a0afd0904de466dc8209f5890637dd33f32feb19e8db55daf2a9deebd5ea689ea2be1a405cc23d
Solana Address (Public Key): Fqmhdj59cDyCmsqPAjHVNf64YnneZ1EwKXnMRV8qEUcU

Derivation Path: m/44'/501'/0'/3'
Derived Seed (hex): 5300c289c475eb6bf34c1d85962e640d881a6945b9032a010760a5858e5b3d84
Private Key (hex): 5300c289c475eb6bf34c1d85962e640d881a6945b9032a010760a5858e5b3d84acbd3421fb5665d70896891a24be5e093c522721a2b5857f5a0bf6003ba924b3
Solana Address (Public Key): CdJTVG3mKYuyZqwfZSnvipdkjTknX1YSZWuiY76d65qU

--- START FOR ETHEREUM ---


Derivation Path: m/44'/60'/0'/0'
Derived Seed (hex): b22702330bfdd408425e8762356d56e4aeb86f7e4538bef6a70fca85257d83bd
Private Key (hex): 0xb22702330bfdd408425e8762356d56e4aeb86f7e4538bef6a70fca85257d83bd
Ethereum Address (Public Key): 0xC678AaB6f6AF564db88c40d40aafE54C27dbE9d5

Derivation Path: m/44'/60'/0'/1'
Derived Seed (hex): db1d50331dcbd1a47cfe7cd847e8b3ca49bdf0fd34e9fc04139198b4c6dc3122
Private Key (hex): 0xdb1d50331dcbd1a47cfe7cd847e8b3ca49bdf0fd34e9fc04139198b4c6dc3122
Ethereum Address (Public Key): 0xFF9AB57C07E4eBAC630C22A9b8bEDcb7bf85d79a

Derivation Path: m/44'/60'/0'/2'
Derived Seed (hex): 610f55a0051281e7f43d9b4f2781205bdfbfc0b6594e2a91ea721bdb16dff9d4
Private Key (hex): 0x610f55a0051281e7f43d9b4f2781205bdfbfc0b6594e2a91ea721bdb16dff9d4
Ethereum Address (Public Key): 0xA190cC64bF8b50056B5f199b9F3a6e26C1A8469f

Derivation Path: m/44'/60'/0'/3'
Derived Seed (hex): 403ead259d896e2d222aa4e9b345a83bab3d8abcad3e307feffcb43f2bacd8a9
Private Key (hex): 0x403ead259d896e2d222aa4e9b345a83bab3d8abcad3e307feffcb43f2bacd8a9
Ethereum Address (Public Key): 0xBcF6b6e4B3b99EB350c93D01256b5c1D067790d3

Note: The actual mnemonic, derived seeds, secret keys, and addresses will vary each time the script is run, as it generates a random mnemonic.
*/
