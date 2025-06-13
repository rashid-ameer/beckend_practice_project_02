import HTTP_CODES from "../constants/httpCodes";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createUser, loginUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";
import { setAuthCookies } from "../utils/cookies";

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
