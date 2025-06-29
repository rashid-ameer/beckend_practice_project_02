import crypto from "crypto";

export const generateOTP = (length: number) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);

  let otp = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    otp += chars[randomIndex];
  }

  return otp;
};
