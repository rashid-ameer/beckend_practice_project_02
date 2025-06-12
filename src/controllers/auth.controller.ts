import asyncHandler from "../utils/asyncHandler";

export const registerHandler = asyncHandler(async (_, res) => {
  res.status(200).json({ route: "Auth register" });
});
