import { Router } from "express";
import {
  getLoggedInUserHandler,
  getUserHandler,
} from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /users
userRoutes.get("/", getLoggedInUserHandler);
userRoutes.get("/:id", getUserHandler);

export default userRoutes;
