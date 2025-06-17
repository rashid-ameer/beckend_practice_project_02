import {
  createUser,
  loginUser,
  refreshAccessToken,
} from "../services/auth.service";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";
import ERROR_CODES from "../constants/errorCodes";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import ApiError from "../utils/apiError";

export const registerHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = registerSchema.parse(req.body);

  // call service
  const { user, accessToken, refreshToken } = await createUser(request);

  // return resposne
  setAuthCookies({ res, refreshToken })
    .status(HTTP_CODES.CREATED)
    .json({ message: "User created successfully.", user, accessToken });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = loginSchema.parse(req.body);

  // call a service
  const { user, accessToken, refreshToken } = await loginUser(request);

  // return response
  setAuthCookies({ res, refreshToken })
    .status(HTTP_CODES.OK)
    .json({ message: "User logged in successfully.", user, accessToken });
});

export const logoutHandler = asyncHandler(async (_, res) => {
  // return a response
  clearAuthCookies(res)
    .status(200)
    .json({ message: "User logout successfully." });
});

export const refreshAccessTokenHandler = asyncHandler(async (req, res) => {
  // validate a request
  const refreshToken = req.cookies.refreshToken as string | undefined;
  if (!refreshToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Refresh token is required.",
      ERROR_CODES.INVALID_REFRESH_TOKEN
    );
  }

  // call a service
  const { accessToken, newRefreshToken } = await refreshAccessToken(
    refreshToken
  );

  // return a response
  setAuthCookies({ res, refreshToken: newRefreshToken })
    .status(HTTP_CODES.OK)
    .json({ message: "Access token refresh successfully.", accessToken });
});
