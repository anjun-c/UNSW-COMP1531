import bcrypt from 'bcrypt';

const saltRounds = 5;

/**
 * Hashes a password using bcrypt and returns the hash
 * @param password
 * @returns {string} - The hash of the password
 */
export function hashPassword(password: string): string {
  const hash = bcrypt.hashSync(password, saltRounds);
  return hash;
}

/**
 * Uses bcrypt to check if a plain string password matches the hash
 * @param password - The plain text password
 * @param hash - The hash to compare the password to
 * @returns {boolean} - Returns true if the password matches, false otherwise
 */
export function checkPassword(password: string, hash: string): boolean {
  const match = bcrypt.compareSync(password, hash);
  return match;
}
