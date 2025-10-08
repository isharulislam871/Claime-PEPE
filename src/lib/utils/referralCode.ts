import User from '@/models/User';
import dbConnect from '@/lib/mongodb';

/**
 * Generate a random referral code with improved randomness
 */
export function generateReferralCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Use crypto.getRandomValues for better randomness if available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += characters.charAt(array[i] % characters.length);
    }
  } else {
    // Fallback to Math.random with additional entropy
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      result += characters.charAt(randomIndex);
    }
  }
  
  return result;
}

/**
 * Generate a unique referral code that doesn't exist in database
 */
export async function generateUniqueReferralCode(length: number = 8): Promise<string> {
  await dbConnect();
  
  let referralCode: string;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (!isUnique && attempts < maxAttempts) {
    referralCode = generateReferralCode(length);
    
    // Check if code already exists
    const existingUser = await User.findOne({ referralCode });
    if (!existingUser) {
      isUnique = true;
    }
    attempts++;
  }
  
  if (!isUnique) {
    throw new Error('Failed to generate unique referral code after maximum attempts');
  }
  
  return referralCode!;
}

/**
 * Validate referral code format
 */
export function isValidReferralCode(code: string): boolean {
  const pattern = /^[A-Z0-9]{6,12}$/;
  return pattern.test(code);
}

/**
 * Find user by referral code
 */
export async function findUserByReferralCode(referralCode: string) {
  await dbConnect();
  return await User.findOne({ referralCode });
}
