import HTTP_CODES from "../constants/httpCodes";
import PostModel from "../models/post.model";
import ApiError from "../utils/apiError";

interface CreatePostParams {
  content: string;
  author: string;
}
export const createPost = async ({ content, author }: CreatePostParams) => {
  const post = await PostModel.create({ content, author });
  if (!post) {
    throw new ApiError(
      HTTP_CODES.INTERNAL_SERVER_ERROR,
      "Failed to create post. Please try again."
    );
  }
  return post;
};
