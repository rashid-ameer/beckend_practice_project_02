import { z } from "zod";
import { mongooseIdSchema } from "./common.schema";

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

export const updatePostSchema = z.object(
  {
    content: z
      .string()
      .min(2, "Post must be at least 2 characters long.")
      .optional(),
    id: mongooseIdSchema("Post id is required.", "Invalid post id"),
  },
  {
    required_error: "Schema object is required.",
    invalid_type_error: "Invalid schema object.",
  }
);
