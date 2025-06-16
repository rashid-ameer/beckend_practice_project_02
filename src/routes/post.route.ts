import { Router } from "express";
import { createPostHandler } from "../controllers/post.controller";

const postRoutes = Router();

// prefix: /posts
postRoutes.post("/create", createPostHandler);

export default postRoutes;
