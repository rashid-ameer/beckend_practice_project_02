import { Router } from "express";
import {
  createPostHandler,
  updatePostHandler,
} from "../controllers/post.controller";

const postRoutes = Router();

// prefix: /posts
postRoutes.post("/create", createPostHandler);
postRoutes.patch("/update/:id", updatePostHandler);

export default postRoutes;
