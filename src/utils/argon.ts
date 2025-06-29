import { hash, verify } from "argon2";

export const secureHash = async (value: string): Promise<string> => {
  return hash(value);
};

export const verifyHash = async (
  hashedValue: string,
  value: string
): Promise<boolean> => {
  return verify(hashedValue, value);
};
