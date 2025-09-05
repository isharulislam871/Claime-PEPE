import crypto from 'crypto';


const secretKey = crypto.createHash('sha256').update('my_super_secret_key').digest(); // 32 bytes
const iv = crypto.randomBytes(16);

export function encrypt(value: string) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(value, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}


export function decrypt(encryptedValue: string) {
  const [ivHex, encrypted] = encryptedValue.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    secretKey,
    Buffer.from(ivHex, 'hex')
  );
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}