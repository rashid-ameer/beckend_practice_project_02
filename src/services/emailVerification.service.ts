import HTTP_CODES from "../constants/httpCodes";
import EmailVerificationModel from "../models/emailVerification.model";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";
import { getUserById } from "./user.service";

interface CreateEmailVerificationParams {
  code: string;
  userId: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}
export const createEmailVerification = async (
  props: CreateEmailVerificationParams
) => {
  return EmailVerificationModel.create(props);
};

interface VerifyUserEmailParams {
  code: string;
  userId: string;
}
export const verifyUserEmail = async ({
  code,
  userId,
}: VerifyUserEmailParams) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "User not found.");
  }

  if (user.isVerified) {
    return { user: user.omitPassword(), alreadyVerified: true };
  }

  const emailVerificationRecord = await EmailVerificationModel.findOne({
    userId,
  });

  if (!emailVerificationRecord) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid verfication code.");
  }

  if (emailVerificationRecord.code !== code) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid verfication code.");
  }

  const expiryTimestamp = new Date(emailVerificationRecord.expiresAt).getTime();
  if (Date.now() > expiryTimestamp) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Expired verification code.");
  }

  user.isVerified = true;
  const updatedUser = await user.save();
  await emailVerificationRecord.deleteOne();

  return { user: updatedUser.omitPassword() };
};
