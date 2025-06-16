import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";
import jwt from "jsonwebtoken";
import {
  AccessTokenPayload,
  RefreshTokenPayload,
  verifyJWT,
} from "../utils/jwt";
import ERROR_CODES from "../constants/errorCodes";

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
  // if not register the user
  const user = await UserModel.create(data);
  if (!user) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create user. Please try again."
    );
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

export const logoutUser = async (accessToken: string) => {
  const { payload } = verifyJWT<AccessTokenPayload>(
    accessToken,
    ACCESS_TOKEN_SECRET
  );

  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid access token.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  const user = await UserModel.findById(payload.id);

  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid access token",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }
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

  const user = await UserModel.findById(payload.id);

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
