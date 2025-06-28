import HTTP_CODES from "../constants/httpCodes";
import { verifyEmailSchema } from "../schemas/emailVerification.schema";
import { verifyUserEmail } from "../services/emailVerification.service";
import asyncHandler from "../utils/asyncHandler";

export const verifyUserEmailHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = verifyEmailSchema.parse(req.body);
  const userId = req.userId as string;

  // call a service
  const user = await verifyUserEmail({ userId, ...request });

  // return a response
  res
    .status(HTTP_CODES.OK)
    .json({ message: "User verified successfully.", user });
});
