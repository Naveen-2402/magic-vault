import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const PART_A = process.env.ENCRYPTION_KEY_PART_A || '';

/**
 * Generate a consistent 32-byte key using SHA-256.
 * It combines the static Part A (.env) and the dynamic Part B (User input).
 */
const getFullKey = (userPartB: string): Buffer => {
  if (!userPartB) throw new Error("User key fragment is required.");
  
  const combined = PART_A + userPartB;
  // SHA-256 always produces 32 bytes, perfect for AES-256
  return crypto.createHash('sha256').update(combined).digest();
};

/**
 * Encrypts a string using the split-key logic.
 * Returns the IV and the encrypted content as a string.
 */
export const encrypt = (text: string, userPartB: string) => {
  const key = getFullKey(userPartB);
  const iv = crypto.randomBytes(16); // Initialization Vector
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  return {
    iv: iv.toString('hex'),
    content: encrypted
  };
};

/**
 * Decrypts data using the split-key logic.
 * Returns null if the userPartB is incorrect.
 */
// lib/crypto.ts
export const decrypt = (encryptedContent: string, iv: string, userPartB: string): string | null => {
  if (!encryptedContent || !iv) return "";
  try {
    const key = getFullKey(userPartB);
    const decipher = crypto.createDecipheriv(ALGORITHM, key, Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (error) {
    // This happens if the PIN or Part A is wrong
    return "INVALID_KEY"; 
  }
};