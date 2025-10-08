import crypto from 'crypto';

/**
 * Generate a signature hash for authentication purposes
 * @param data - The data to be signed (usually JSON stringified)
 * @param secret - The secret key for signing
 * @returns Object containing the hash
 */
export function generateSignature(data: string, secret: string): { hash: string } {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(data)
    .digest('hex');
  
  return { hash };
}

/**
 * Verify a signature hash
 * @param data - The original data
 * @param secret - The secret key used for signing
 * @param providedHash - The hash to verify against
 * @returns Boolean indicating if the signature is valid
 */
export function verifySignature(data: string, secret: string, providedHash: string): boolean {
  const { hash } = generateSignature(data, secret);
  return hash === providedHash;
}
