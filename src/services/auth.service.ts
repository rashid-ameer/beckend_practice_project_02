import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../constants/env";
import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";
import jwt from "jsonwebtoken";

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
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Invalid email or password.");
  }

  const isPasswordValid = await user.comparePassword(data.password);
  if (!isPasswordValid) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Invalid email or password.");
  }

  const accessToken = jwt.sign({ id: user._id }, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign({ id: user._id }, REFRESH_TOKEN_SECRET, {
    expiresIn: "30d",
  });

  return { user: user.omitPassword(), accessToken, refreshToken };
};
