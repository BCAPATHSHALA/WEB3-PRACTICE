/*
 * This script generates a 12-word mnemonic phrase using the BIP39 standard.
 * Mnemonics are commonly used in cryptocurrency wallets for secure key generation and recovery.
 */

import { generateMnemonic } from "bip39";

// Generate a 12-word mnemonic
const mnemonic = generateMnemonic();
console.log("Generated Mnemonic:", mnemonic);

// Output: Generated Mnemonic: empower gather burger car spoil crop keep fresh beauty crowd sunny favorite
// Note: The actual output will vary each time the script is run, as it generates a random mnemonic.