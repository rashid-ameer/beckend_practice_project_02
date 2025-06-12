import HTTP_CODES from "../constants/httpCodes";
import { loginSchema, registerSchema } from "../schemas/auth.schema";
import { createUser, loginUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

export const registerHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = registerSchema.parse(req.body);
  // call service
  const user = await createUser(request);
  // return resposne
  res.status(HTTP_CODES.CREATED).json({ user });
});

export const loginHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = loginSchema.parse(req.body);
  // call a service
  const user = await loginUser(request);
  // return response
  res.status(HTTP_CODES.OK).json({ user });
});
