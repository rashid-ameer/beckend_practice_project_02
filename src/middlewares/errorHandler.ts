import { type ErrorRequestHandler } from "express";
import HTTP_CODES from "../constants/httpCodes";
import ApiError from "../utils/apiError";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = async (err, req, res, _) => {
  console.log(`PATH: ${req.path} --- METHOD: ${req.method}`);
  console.log(err);

  if (err instanceof ZodError) {
    res.status(HTTP_CODES.BAD_REQUEST).json({ message: err.errors[0].message });
    return;
  }

  if (err instanceof ApiError) {
    res
      .status(err.status)
      .json({ message: err.message, errorCode: err.errorCode });
    return;
  }

  res
    .status(HTTP_CODES.INTERNAL_SERVER_ERROR)
    .json({ message: "Internal server error." });
};

export default errorHandler;
