import { Router } from "express";
import { getLoggedInUserHandler } from "../controllers/user.controller";

const userRoutes = Router();

// prefix: /users
userRoutes.get("/", getLoggedInUserHandler);

export default userRoutes;
