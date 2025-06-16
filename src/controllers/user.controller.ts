import { getUserById } from "../services/user.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import ApiError from "../utils/apiError";

export const getLoggedInUserHandler = asyncHandler(async (req, res) => {
  const request = req.userId as string;
  const user = await getUserById(request);
  if (!user) {
    throw new ApiError(HTTP_CODES.NOT_FOUND, "User not found.");
  }

  res
    .status(HTTP_CODES.OK)
    .json({ message: "User fetched successfully.", user });
});
