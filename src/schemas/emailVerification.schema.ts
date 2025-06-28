import { z } from "zod";

export const verifyEmailSchema = z.object(
  {
    code: z.string({ required_error: "Verification code is requried." }),
  },
  {
    required_error: "Request body is required.",
    invalid_type_error: "Request body must be a valid object.",
  }
);
