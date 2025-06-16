import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { APP_ORIGIN } from "./constants/env";
import authRoutes from "./routes/auth.route";
import errorHandler from "./middlewares/errorHandler";
import authenticate from "./middlewares/authenticate";
import userRoutes from "./routes/user.routes";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

// routes
app.use("/auth", authRoutes);

// protected routes
app.use(authenticate);

app.use("/users", userRoutes);

app.get("/", (_, res) => {
  res.status(200).json({ status: "Healthy" });
});

// error handler
app.use(errorHandler);

export default app;
