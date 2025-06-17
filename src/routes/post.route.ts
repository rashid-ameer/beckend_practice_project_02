import { Router } from "express";
import {
  createPostHandler,
  deletePostHandler,
  updatePostHandler,
} from "../controllers/post.controller";

const postRoutes = Router();

// prefix: /posts
postRoutes.post("/create", createPostHandler);
postRoutes.patch("/update/:id", updatePostHandler);
postRoutes.delete("/delete/:id", deletePostHandler);

export default postRoutes;
