import { AccessTokenPayload, verifyJWT } from "../utils/jwt";
import { ACCESS_TOKEN_SECRET } from "../constants/env";
import { getUserById } from "../services/user.service";
import ERROR_CODES from "../constants/errorCodes";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import ApiError from "../utils/apiError";

const authenticate = asyncHandler(async (req, _, next) => {
  const accessToken = req.headers["authorization"]?.split(" ")?.[1];
  if (!accessToken) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Access token is required.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  const { payload } = verifyJWT<AccessTokenPayload>(
    accessToken,
    ACCESS_TOKEN_SECRET
  );
  if (!payload) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired access token.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  const user = await getUserById(payload.id);
  if (!user) {
    throw new ApiError(
      HTTP_CODES.UNAUTHORIZED,
      "Invalid or expired access token.",
      ERROR_CODES.INVALID_ACCESS_TOKEN
    );
  }

  req.userId = payload.id;
  next();
});

export default authenticate;
