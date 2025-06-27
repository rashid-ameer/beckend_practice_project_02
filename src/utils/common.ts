import crypto from "node:crypto";

export const generateRandomString = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);

  let str = "";

  for (let i = 0; i < 6; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    str += chars[randomIndex];
  }

  return str;
};
