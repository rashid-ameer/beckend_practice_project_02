import HTTP_CODES from "../constants/httpCodes";
import EmailVerificationModel from "../models/emailVerification.model";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";

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

  const user = await UserModel.findByIdAndUpdate(
    userId,
    { isVerified: true },
    { runValidators: true, new: true }
  );

  await emailVerificationRecord.deleteOne();

  return user?.omitPassword();
};
