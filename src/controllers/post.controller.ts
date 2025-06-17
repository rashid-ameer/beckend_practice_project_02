import { createPostSchema, updatePostSchema } from "../schemas/post.schema";
import { createPost, updatePost } from "../services/post.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";

export const createPostHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = createPostSchema.parse(req.body);
  const author = req.userId as string;

  // call a service
  const post = await createPost({ content: request.content, author });

  // return a response
  res
    .status(HTTP_CODES.CREATED)
    .json({ message: "Post created successfully.", post });
});

export const updatePostHandler = asyncHandler(async (req, res) => {
  // validate a request
  const request = updatePostSchema.parse({ ...req.body, id: req.params.id });

  // call a service
  const post = await updatePost(request);

  // return a response
  res
    .status(HTTP_CODES.OK)
    .json({ message: "Post updated successfully.", post });
});
