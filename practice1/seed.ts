/*
 * This script generates a 12-word mnemonic phrase and derives a seed from it using the BIP39 standard.
 * Mnemonics and seeds are commonly used in cryptocurrency wallets for secure key generation and recovery.
 */

import { generateMnemonic, mnemonicToSeedSync } from "bip39";

// Generate a 12-word mnemonic
const mnemonic = generateMnemonic();
console.log("Generated Mnemonic:", mnemonic);

// Derive a seed from the mnemonic
const seed = mnemonicToSeedSync(mnemonic);
console.log("Derived Seed (Buffer):", seed);

// Convert seed to hex string for easier readability (if needed)
const seedHex = seed.toString("hex");
console.log("Derived Seed (hex):", seedHex);

/*
Output:

Generated Mnemonic: sport crunch chronic eyebrow happy crack dish maximum tattoo above addict wife
Derived Seed (Buffer): <Buffer ec 81 b3 06 13 96 90 76 43 86 c0 88 73 88 1d b6 12 b3 61 17 3d ed 1f 65 4a 10 71 2c 0c 3f a3 2b 64 0f 8b c4 00 e7 2a 01 2c 66 bc b2 ed 6a 95 f0 c9 60 ... 14 more bytes>
Derived Seed (hex): ec81b306139690764386c08873881db612b361173ded1f654a10712c0c3fa32b640f8bc400e72a012c66bcb2ed6a95f0c96003b3f470fb39214fadecea6afe5c


Note: The actual mnemonic and seed will vary each time the script is run, as it generates a random mnemonic.
*/
