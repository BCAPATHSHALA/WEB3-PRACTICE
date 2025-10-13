/*
* We are using password with PBKDF2 + AES-GCM to encrypt/decrypt data 
* 1. PBKDF2 (Password-Based Key Derivation Function 2) is a key derivation function that is used to generate a cryptographic strong key from a password for AES encryption.
- window.crypto.subtle.importKey() is a Web Crypto API that allows you to import a key from a password using PBKDF2 algorithm.
- window.crypto.subtle.deriveKey() is a Web Crypto API that allows you to derive a key from a password using PBKDF2 algorithm.

* 2. AES-GSM (Advanced Encryption Standard - Galois/Counter Mode) is used for symmetric encryption it means that the same key is used to encrypt and decrypt data.
- window.crypto.subtle.encrypt() is a Web Crypto API that allows you to encrypt data using AES-GCM algorithm & use the same cryptographic key.
- window.crypto.subtle.decrypt() is a Web Crypto API that allows you to decrypt data using AES-GCM algorithm & use the same cryptographic key.

* Usage: encryptData(JSON.stringify(obj), password) -> ciphertextBase64
*      decryptData(ciphertextBase64, password) -> plaintext string
*/

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

// Method 1: deriveKey is used to generate a cryptographic key from a password and salt
async function PBKDF2(password: string, salt: Uint8Array) {

  // Import the key: convert password to Uint8Array backed by ArrayBuffer
  const pwKey = await crypto.subtle.importKey(
    "raw",                                    // key format 
    textEncoder.encode(password),             // password as Uint8Array
    { name: "PBKDF2" },                       // algorithm for deriving other keys for encryption/decryption 
    false,                                    // whether the key is extractable (e.g. can be exported)
    ["deriveKey"]                             // key usages (means the key can be used to derive other keys for encryption/decryption)
  );
  
  // Derive key: derive a cryptographic key from the imported key & salt
  return crypto.subtle.deriveKey(
    {                                 // PBKDF2 + AES-GCM parameters
      name: "PBKDF2",
      salt: new Uint8Array(salt),
      iterations: 250_000,
      hash: "SHA-256",
    },
    pwKey,                            // password key in Uint8Array
    { name: "AES-GCM", length: 256 }, // algorithm for encryption/decryption
    false,                            // whether the key is extractable (e.g. can be exported)
    ["encrypt", "decrypt"]            // key usages (means the key can be used to encrypt/decrypt data)
  );
}

// Method 2: Concatenate Uint8Array buffers into a single Uint8Array buffer
function concatBuffers(...buffers: Uint8Array[]) {
  const totalLength = buffers.reduce((sum, b) => sum + b.length, 0);
  const newBuffer = new Uint8Array(totalLength);
  let offset = 0;
  for (const b of buffers) {
    newBuffer.set(b, offset);
    offset += b.length;
  }
  return newBuffer;
}

// Method 3: Convert Uint8Array to base64 string (when saving data into local storage)
function toBase64(u8: Uint8Array) {
  const binary = String.fromCharCode(...u8);
  const b64 = btoa(binary); // binary -> base64
  return b64;
}

// Method 4: Convert base64 string to Uint8Array (when loading data from local storage to show on client side)
function fromBase64(b64: string) {
  const binary = atob(b64); // base64 -> binary
  const len = binary.length;
  const u8 = new Uint8Array(len); 
  for (let i = 0; i < len; i++) {
    u8[i] = binary.charCodeAt(i);
  }
  return u8;
}

// Step 1: Encrypt data before saving data into local storage
export async function encryptData(plainText: string, password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));  // PBKDF2 128-bit salt (a random number sequence to protect against rainbow table attacks)
  const iv = crypto.getRandomValues(new Uint8Array(12));    // AES-GCM 96-bit IV (a random number sequence to protect against padding oracle attacks)
  const cryptographickey = await PBKDF2(password, salt);    // Return a derived/cryptographic key from password and salt (this is the actual key used for encryption)
  const cipherBuffer = await crypto.subtle.encrypt(         // Encrypt data using AES-GCM algorithm
    { name: "AES-GCM", iv },
    cryptographickey,
    textEncoder.encode(plainText) 
  );
  const cipherU8 = new Uint8Array(cipherBuffer);            // Convert ArrayBuffer to Uint8Array

  // store: salt(16) | iv(12) | ciphertext(...)
  const payload = concatBuffers(salt, iv, cipherU8);        // Concatenate Uint8Array buffers to a single Uint8Array
  return toBase64(payload);                                 // Convert Uint8Array to base64 string (store in local storage)
}

// Decrypt data from local storage to show on client side
export async function decryptData(payloadB64: string, password: string) {
  const payload = fromBase64(payloadB64);                  // Convert base64 string to Uint8Array
  const salt = payload.slice(0, 16);                       // Extract salt from payload
  const iv = payload.slice(16, 28);                        // Extract IV from payload
  const cipher = payload.slice(28);                        // Extract ciphertext from payload
  const cryptographickey = await PBKDF2(password, salt);   // Return a derived/cryptographic key from password and salt (this is the actual key used for decryption)
  const plainBuffer = await crypto.subtle.decrypt(         // Decrypt data using AES-GCM algorithm
    { name: "AES-GCM", iv },
    cryptographickey,
    cipher 
  );
  return textDecoder.decode(new Uint8Array(plainBuffer));   // Convert ArrayBuffer to string (render on client side)
}

// USAGES

encryptData("Hello World", "password").then(
  (ciphertextBase64) => {
    console.log("Ciphertext (base64):", ciphertextBase64);
    console.log("Ciphertext Length:", ciphertextBase64.length);
    console.log("Uint8Array from Ciphertext:", fromBase64(ciphertextBase64));
    console.log("Salt from Ciphertext:", fromBase64(ciphertextBase64).slice(0, 16));
    console.log("IV from Ciphertext:", fromBase64(ciphertextBase64).slice(16, 28));
    console.log("Ciphertext from Ciphertext:", fromBase64(ciphertextBase64).slice(28));

    decryptData(ciphertextBase64, "password").then((plaintext) => {
      console.log("Plaintext:", plaintext);
    });
  }
);

// Output:
// Ciphertext (base64): e504YaYQNlPhqDlqgBBRmcnIW3RT95A/gT2QJFzb0CQTqi1KM0+MP2Eje3qZZQbzO0BGw+Ovsw==
// Plaintext: Hello World