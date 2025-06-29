import HTTP_CODES from "../constants/httpCodes";
import { verifyEmailSchema } from "../schemas/emailVerification.schema";
import {
  resendVerificationEmail,
  verifyUserEmail,
} from "../services/emailVerification.service";
import asyncHandler from "../utils/asyncHandler";

export const verifyUserEmailHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = verifyEmailSchema.parse(req.body);
  const userId = req.userId as string;

  // call a service
  const { user, alreadyVerified } = await verifyUserEmail({
    userId,
    ...request,
  });

  if (alreadyVerified) {
    res
      .status(HTTP_CODES.OK)
      .json({ message: "User is already verified.", user });
    return;
  }

  // return a response
  res
    .status(HTTP_CODES.OK)
    .json({ message: "User verified successfully.", user });
});

export const resendVerificationEmailHandler = asyncHandler(async (req, res) => {
  const userId = req.userId as string;

  // call a service
  const userVerifiedStatus = await resendVerificationEmail(userId);
  if (!userVerifiedStatus) {
    res.status(HTTP_CODES.OK).json({ message: "User is already verified." });
  }

  // return a response
  res.status(HTTP_CODES.OK).json({ message: "Email send successfully." });
});
