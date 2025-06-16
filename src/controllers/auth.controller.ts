import { ACCESS_TOKEN_SECRET, NODE_ENV } from "../constants/env";
import ERROR_CODES from "../constants/errorCodes";
import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createUser, loginUser, logoutUser } from "../services/auth.service";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import {
  clearAuthCookies,
  REFRESH_PATH,
  setAuthCookies,
} from "../utils/cookies";
import jwt from "jsonwebtoken";
import { AccessTokenPayload, verifyJWT } from "../utils/jwt";

export const registerHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = registerSchema.parse(req.body);

  // call service
  const { user, accessToken, refreshToken } = await createUser(request);

  // return resposne
  setAuthCookies({ res, refreshToken })
    .status(HTTP_CODES.CREATED)
    .json({ user, accessToken });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = loginSchema.parse(req.body);

  // call a service
  const { user, accessToken, refreshToken } = await loginUser(request);

  // return response
  setAuthCookies({ res, refreshToken })
    .status(HTTP_CODES.OK)
    .json({ user, accessToken });
});

export const logoutHandler = asyncHandler(async (req, res) => {
  // validate a request
  const accessToken = req.headers["authorization"]?.split(" ")?.[1];

  if (!accessToken) {
    throw new ApiError(HTTP_CODES.UNAUTHORIZED, "Access token is required.");
  }

  // call a service
  await logoutUser(accessToken);

  // return a response
  clearAuthCookies(res)
    .status(200)
    .json({ message: "User logout successfully." });
});
