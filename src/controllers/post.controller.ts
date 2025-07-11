import { createPostSchema, updatePostSchema } from "../schemas/post.schema";
import {
  createPost,
  deletePost,
  getPostsByAuthorId,
  updatePost,
} from "../services/post.service";
import asyncHandler from "../utils/asyncHandler";
import HTTP_CODES from "../constants/httpCodes";
import { mongooseIdSchema } from "../schemas/common.schema";

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

export const deletePostHandler = asyncHandler(async (req, res) => {
  // validate a request
  const id = mongooseIdSchema("Post id is required.", "Invalid post id.").parse(
    req.params.id
  );

  // call a servide
  await deletePost(id);

  // return a response
  res.status(HTTP_CODES.OK).json({ message: "Post deleted successfully." });
});

export const getAuthorPostsHandler = asyncHandler(async (req, res) => {
  const authorId = mongooseIdSchema(
    "Author id is required.",
    "Invalid author id"
  ).parse(req.params.id);

  const posts = await getPostsByAuthorId(authorId);

  res
    .status(HTTP_CODES.OK)
    .json({ message: "Fetched posts successfully.", posts });
});

export const getLoggedInAuthorPostsHandler = asyncHandler(async (req, res) => {
  const authorId = req.userId as string;
  const posts = await getPostsByAuthorId(authorId);
  res
    .status(HTTP_CODES.OK)
    .json({ message: "Posts fetched successfully.", posts });
});
