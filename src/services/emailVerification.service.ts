import HTTP_CODES from "../constants/httpCodes";
import { getVerifyEmailTemplate } from "../emailTemplates";
import EmailVerificationModel from "../models/emailVerification.model";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";
import { generateRandomString } from "../utils/common";
import sendEmail from "../utils/sendMail";
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

export const resendVerificationEmail = async (userId: string) => {
  await EmailVerificationModel.deleteMany({ userId });
  const user = await getUserById(userId);

  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "User not found");
  }

  const code = generateRandomString(6);
  const emailVerification = await createEmailVerification({
    code,
    userId,
    email: user.email,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  if (!emailVerification) {
    throw new ApiError(
      HTTP_CODES.SERVICE_TEMPORARY_UNAVAILABLE,
      "Error in sending email. Please try again."
    );
  }

  const { error } = await sendEmail({
    to: user.email,
    ...getVerifyEmailTemplate(code),
  });
  if (error) {
    throw new ApiError(
      HTTP_CODES.SERVICE_TEMPORARY_UNAVAILABLE,
      "Error in sending email. Please try again."
    );
  }
};
