import crypto from 'crypto';

const ADMIN_USERNAME = 'admin';
const SALT = 'mahd_and_mint_yemeni_admin_salt_2026';

// Pre-calculated PBKDF2 hash for password 'admin425477'
const HASHED_PASSWORD = crypto.pbkdf2Sync('admin425477', SALT, 1000, 64, 'sha512').toString('hex');

export function verifyAdminCredentials(user: string, pass: string): boolean {
  if (user !== ADMIN_USERNAME) return false;
  const hash = crypto.pbkdf2Sync(pass, SALT, 1000, 64, 'sha512').toString('hex');
  return hash === HASHED_PASSWORD;
}

export function generateAdminSessionToken(): string {
  const time = Date.now();
  const raw = `admin_logged_in_${time}_${SALT}`;
  return crypto.createHash('sha256').update(raw).digest('hex');
}
