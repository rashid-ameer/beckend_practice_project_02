import {
  ACCESS_TOKEN_SECRET,
  APP_ORIGIN,
  REFRESH_TOKEN_SECRET,
} from "../constants/env";
import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";
import jwt from "jsonwebtoken";
import { RefreshTokenPayload, verifyJWT } from "../utils/jwt";
import ERROR_CODES from "../constants/errorCodes";
import { getUserById } from "./user.service";
import { generateOTP } from "../utils/common";
import { createEmailVerification } from "./emailVerification.service";
import sendEmail from "../utils/sendMail";
import {
  getPasswordResetTemplate,
  getVerifyEmailTemplate,
} from "../emailTemplates";
import { verifyHash } from "../utils/argon";
import PasswordResetModel from "../models/passwordReset.model";
import crypto from "crypto";

interface CreateUserParams {
  email: string;
  username: string;
  password: string;
}

export const createUser = async (data: CreateUserParams) => {
  // check if user already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(HTTP_CODES.CONFLICT, "Email already exists.");
  }
  // register the user
  const user = await UserModel.create(data);
  if (!user) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create user. Please try again."
    );
  }

  const code = generateOTP(6);

  const emailVerification = await createEmailVerification({
    code,
    userId: user.id,
    email: user.email,
    createdAt: new Date(),
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  if (emailVerification) {
    sendEmail({
      to: user.email,
      ...getVerifyEmailTemplate(code),
    });
  }

  // sign access and refresh token
  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  // send the response back
  return { user: user.omitPassword(), accessToken, refreshToken };
};

interface LoginUserParams {
  email: string;
  password: string;
}
export const loginUser = async (data: LoginUserParams) => {
  const user = await UserModel.findOne({ email: data.email });
  if (!user) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Incorrect email or password.");
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Incorrect email or password.");
  }

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { user: user.omitPassword(), accessToken, refreshToken };
};

export const refreshAccessToken = async (refreshToken: string) => {
  const { payload } = verifyJWT<RefreshTokenPayload>(
    refreshToken,
    REFRESH_TOKEN_SECRET
  );

  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired refresh token.",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  const user = await getUserById(payload.id);

  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired refresh token.",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { accessToken, newRefreshToken };
};

export const requestPasswordReset = async (email: string) => {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "Email not found.");
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  await PasswordResetModel.create({
    userId: user._id,
    email: user.email,
    token: hashedToken,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  const url = `${APP_ORIGIN}/password-reset/${token}`;
  const { error } = await sendEmail({
    to: user.email,
    ...getPasswordResetTemplate(url),
  });
  if (error) {
    throw new ApiError(
      HTTP_CODES.SERVICE_TEMPORARY_UNAVAILABLE,
      "Failed to send email. Please try again."
    );
  }
};

interface ResetPasswordParams {
  password: string;
  token: string;
}
export const resetPassword = async ({
  password,
  token,
}: ResetPasswordParams) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const passwordRecord = await PasswordResetModel.findOne({
    token: hashedToken,
    expiresAt: { $gt: new Date() },
  });
  if (!passwordRecord) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid or expired token.");
  }

  const user = await UserModel.findById(passwordRecord.userId);
  if (!user) {
    throw new ApiError(HTTP_CODES.BAD_REQUEST, "Invalid or expired token.");
  }

  const isPasswordSame = await verifyHash(user.password, password);
  if (isPasswordSame) {
    throw new ApiError(
      HTTP_CODES.BAD_REQUEST,
      "New password cannot be same as old password."
    );
  }

  await passwordRecord.deleteOne();

  user.password = password;
  user.isVerified = true;
  const updatedUser = await user.save();
  return updatedUser.omitPassword();
};
