/*
* Create the public/private keypair using Solana web3.js library and sign/verify a message using TweetNaCl library
Steps:
1. Generate a new keypair
2. Extract the public and private keys from keypair
🔥 Important Step: Encode both keys from Unit8Array to base58 string format
3. Define a message & convert the message "hello world" to a Uint8Array
🔥 Important Step: Decode both keys from base58 string to Unit8Array format
4. Sign the message "hello world" using private key
5. Verify the signed message using public key through TweetNaCl (Networking and Cryptography library)
*/

import { Keypair } from "@solana/web3.js";
import nacl from "tweetnacl";
import bs58 from "bs58";

// 1. Generate a new keypair
const keypair = Keypair.generate();
console.log("Keypair:", keypair);

// 2. Extract the public and private keys from keypair
const publicKey = keypair.publicKey;
const secretKey = keypair.secretKey;

// Display the keys in Uint8Array format
console.log("Public Key (Unit8Array-32bits):", publicKey.toBytes());
console.log("Private Key (Unit8Array-64bits):", secretKey);

// 🔥 Important Step: Convert both keys to base58 string format for human reading friendly
const publicKeyEncoded = bs58.encode(publicKey.toBytes());
const secretKeyEncoded = bs58.encode(secretKey);
console.log("Public Key (Base58-32bits):", publicKeyEncoded);
console.log("Private Key (Base58-64bits):", secretKeyEncoded);

// 3. Define a message & convert the message "hello world" to a Uint8Array
const defineMessage = "hello world";
const message = new TextEncoder().encode(defineMessage);
console.log("Message (Unit8Array):", message);

// 🔥 Important Step: Decode both keys from base58 string to Unit8Array format
const publicKeyDecoded = bs58.decode(publicKeyEncoded);
const secretKeyDecoded = bs58.decode(secretKeyEncoded);
console.log("Decoded Public Key (Unit8Array-32bits):", publicKeyDecoded);
console.log("Decoded Private Key (Unit8Array-64bits):", secretKeyDecoded);

// 4. Sign the message "hello world" using private key
const signature = nacl.sign.detached(message, secretKeyDecoded);
console.log("Signature (Unit8Array-64bits):", signature);

// 5. Verify the signed message using public key through TweetNaCl (Networking and Cryptography library)
const result = nacl.sign.detached.verify(message, signature, publicKeyDecoded);
console.log("Signature Verification Result:", result);

/*
Output:
Keypair: Keypair {
  _keypair: {
    publicKey: Uint8Array(32) [ 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ],
    secretKey: Uint8Array(64) [ 224, 227, 2, 64, 207, 72, 180, 165, 82, 227, 153, 176, 130, 253, 128, 29, 225, 204, 39, 101, 175, 229, 234, 218, 0, 180, 175, 84, 113, 20, 61, 12, 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ],
  },
  publicKey: [Getter],
  secretKey: [Getter],
}

Public Key (Unit8Array-32bits): Uint8Array(32) [ 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ]
Private Key (Unit8Array-64bits): Uint8Array(64) [ 224, 227, 2, 64, 207, 72, 180, 165, 82, 227, 153, 176, 130, 253, 128, 29, 225, 204, 39, 101, 175, 229, 234, 218, 0, 180, 175, 84, 113, 20, 61, 12, 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ]

Public Key (Base58-32bits): H8QxMjpLe71gsXmDDNnM1SFWcc4GC6vg71x9HWH5Ze3L
Private Key (Base58-64bits): 5VnEqr84B9PdFExH5Dnghg9wtMhTCTXwgaDTDxZer9M8EH4dojwH6uRPbGV6UZTRwon4BDajB1uRJ7rHCxvWqYvn

Message (Unit8Array): Uint8Array(11) [ 104, 101, 108, 108, 111, 32, 119, 111, 114, 108, 100 ]

Decoded Public Key (Unit8Array-32bits): Uint8Array(32) [ 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ]
Decoded Private Key (Unit8Array-64bits): Uint8Array(64) [ 224, 227, 2, 64, 207, 72, 180, 165, 82, 227, 153, 176, 130, 253, 128, 29, 225, 204, 39, 101, 175, 229, 234, 218, 0, 180, 175, 84, 113, 20, 61, 12, 239, 161, 36, 80, 198, 21, 227, 72, 108, 211, 64, 133, 85, 33, 181, 142, 35, 229, 251, 188, 115, 157, 113, 139, 73, 99, 1, 124, 183, 95, 181, 59 ]

Signature (Unit8Array-64bits): Uint8Array(64) [ 184, 107, 146, 241, 55, 199, 85, 149, 224, 80, 121, 2, 74, 12, 69, 18, 228, 149, 82, 82, 126, 7, 154, 3, 194, 194, 131, 146, 23, 126, 38, 222, 201, 17, 156, 214, 9, 255, 94, 213, 170, 141, 102, 152, 58, 202, 87, 136, 129, 97, 141, 32, 16, 50, 232, 117, 219, 77, 70, 60, 105, 111, 132, 14 ]

Signature Verification Result: true
*/
