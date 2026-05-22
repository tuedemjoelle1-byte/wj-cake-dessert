import { randomBytes, scrypt as scryptCallback, timingSafeEqual, scryptSync } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export function hashPasswordSync(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, KEY_LENGTH);
  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  if (!storedHash) {
    return false;
  }

  if (!storedHash.startsWith("scrypt:")) {
    return storedHash === password;
  }

  const [, salt, expectedHex] = storedHash.split(":");
  const derivedKey = await scrypt(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHex, "hex");

  if (expected.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(expected, derivedKey);
}
