/*
* Create the public/private keypair using Ethers.js library and sign/verify a message using built-in methods
Steps:
1. Generate a random wallet
2. Extract the public and private keys from wallet
🔥 Important Step: Convert both keys to base58 string format (We don't need to this step)
3. Define message "hello world" & convert the message into a Uint8Array
🔥 Important Step: Decode both keys from base58 string to Unit8Array format (We don't need to this step)
4. Sign the message using the wallet's private key
5. Verify the signature using wallet's public key
*/

import { ethers } from "ethers";

// 1. Generate a random wallet
const wallet = ethers.Wallet.createRandom();
console.log("Wallet:", wallet);

// 2. Extract the public and private keys from wallet
const publicKey = wallet.address;
const privateKey = wallet.privateKey;
console.log("Public Key (Address):", publicKey);
console.log("Private Key:", privateKey);

// 🔥 Important Step: Convert both keys to base58 string format (We don't need to this step)
// In Ethereum, the public key is typically represented as an address, which is already in a human-readable format
// The private key is already in hex string format, which is also human-readable

// 3. Define message "hello world" ()
const message = "hello world";

// 🔥 Important Step: Decode both keys from base58 string to Unit8Array format (We don't need to this step)
// In Ethereum, the keys are already in a suitable format for signing and verification
// The private key is used directly for signing, and the address is used for verification

// 4. Sign the message using the wallet's private key
const signature = await wallet.signMessage(message);
console.log("Signature:", signature);

// 5. Verify the signature using wallet's public key
const recoveredAddress = ethers.verifyMessage(message, signature);
console.log("Recovered Address:", recoveredAddress);
console.log("Signature is valid:", recoveredAddress === publicKey);

/*
Output:
Wallet: HDNodeWallet {
  provider: null,
  address: "0xFFBd7468466c2d07d5e2311E79DE44287158F81a",
  publicKey: "0x021f04641929396af1e5827b36e4468e444e94ed2c2d65d7e8f63a00a54f286540",
  fingerprint: "0xe4cc6639",
  parentFingerprint: "0x41d89899",
  mnemonic: Mnemonic {
    phrase: "cinnamon input glow tuition main safe desk sentence style thrive bar swamp",
    password: "",
    wordlist: LangEn {
      locale: "en",
      _data: [Getter],
      _decodeWords: [Function: _decodeWords],
      getWord: [Function: getWord],
      getWordIndex: [Function: getWordIndex],
      split: [Function: split],
      join: [Function: join],
    },
    entropy: "0x290e958f7518657c0efe1fd7dc2449ed",
    computeSeed: [Function: computeSeed],
  },
  chainCode: "0xc1c63e2def756c45581ba521fa3e533721b6ed28b1f3320d76a94183d80fdf29",
  path: "m/44'/60'/0'/0/0",
  index: 0,
  depth: 5,
  connect: [Function: connect],
  encrypt: [AsyncFunction: encrypt],
  encryptSync: [Function: encryptSync],
  extendedKey: [Getter],
  hasPath: [Function: hasPath],
  neuter: [Function: neuter],
  deriveChild: [Function: deriveChild],
  derivePath: [Function: derivePath],
  signingKey: [Getter],
  privateKey: [Getter],
  getAddress: [AsyncFunction: getAddress],
  signTransaction: [AsyncFunction: signTransaction],
  signMessage: [AsyncFunction: signMessage],
  signMessageSync: [Function: signMessageSync],
  authorizeSync: [Function: authorizeSync],
  authorize: [AsyncFunction: authorize],
  signTypedData: [AsyncFunction: signTypedData],
  getNonce: [AsyncFunction: getNonce],
  populateCall: [AsyncFunction: populateCall],
  populateTransaction: [AsyncFunction: populateTransaction],
  populateAuthorization: [AsyncFunction: populateAuthorization],
  estimateGas: [AsyncFunction: estimateGas],
  call: [AsyncFunction: call],
  resolveName: [AsyncFunction: resolveName],
  sendTransaction: [AsyncFunction: sendTransaction],
}

Public Key (Address): 0xFFBd7468466c2d07d5e2311E79DE44287158F81a
Private Key: 0x66e2f61b5aca059bf2aaae08080bb3658e5d7d309040fcffc0ac68fed779e1d8

Signature: 0x8c576b29f4bed2993ecf7e65e684cf6dc5b701905ea42ef123790f1b28e749d60be65163a292b1d3c49cc17952f1dea54fce082b0f10e0159d42494320c067e81b

Recovered Address: 0xFFBd7468466c2d07d5e2311E79DE44287158F81a
Signature is valid: true
*/
