import { z } from "zod";

export const createPostSchema = z.object(
  {
    content: z
      .string({ required_error: "Content field is required." })
      .min(2, "Post must be at least 2 characters long."),
  },
  {
    required_error: "Request body is required.",
    invalid_type_error: "Request body must be a valid object.",
  }
);
