import HTTP_CODES from "../constants/httpCodes";
import { registerSchema } from "../schemas/auth.schema";
import { createUser } from "../services/auth.service";
import asyncHandler from "../utils/asyncHandler";

export const registerHandler = asyncHandler(async (req, res) => {
  // verify request
  const request = registerSchema.parse(req.body);
  // call service
  const user = await createUser(request);
  // send resposne
  res.status(HTTP_CODES.CREATED).json({ user });
});
