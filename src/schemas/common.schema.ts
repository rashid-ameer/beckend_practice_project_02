import mongoose from "mongoose";
import { z } from "zod";

export const mongooseIdSchema = (
  requiredError: string,
  validationError: string
) =>
  z
    .string({ required_error: requiredError })
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: validationError,
    });
