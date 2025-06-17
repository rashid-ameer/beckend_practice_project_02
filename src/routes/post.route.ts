import { Router } from "express";
import {
  createPostHandler,
  deletePostHandler,
  getAuthorPostsHandler,
  updatePostHandler,
} from "../controllers/post.controller";

const postRoutes = Router();

// prefix: /posts
postRoutes.post("/create", createPostHandler);
postRoutes.patch("/update/:id", updatePostHandler);
postRoutes.delete("/delete/:id", deletePostHandler);
postRoutes.get("/author/:id", getAuthorPostsHandler);

export default postRoutes;
