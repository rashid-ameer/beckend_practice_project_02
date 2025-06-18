import { Router } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getAuthorPostsHandler,
  getLoggedInAuthorPostsHandler,
  updatePostHandler,
} from "../controllers/post.controller";

const postRoutes = Router();

// prefix: /posts
postRoutes.post("/create", createPostHandler);
postRoutes.patch("/update/:id", updatePostHandler);
postRoutes.delete("/delete/:id", deletePostHandler);
postRoutes.get("/author/:id", getAuthorPostsHandler);
postRoutes.get("/author", getLoggedInAuthorPostsHandler);

export default postRoutes;
