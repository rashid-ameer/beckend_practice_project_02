import ERROR_CODES from "../constants/errorCodes";
import HTTP_CODES from "../constants/httpCodes";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import {
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
} from "../services/auth.service";
import ApiError from "../utils/apiError";
import asyncHandler from "../utils/asyncHandler";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies";

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
