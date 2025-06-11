import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import { APP_ORIGIN } from "./constants/env";

const app = express();

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: APP_ORIGIN, credentials: true }));

app.get("/", (_, res) => {
  res.status(200).json({ status: "Healthy" });
});

export default app;
