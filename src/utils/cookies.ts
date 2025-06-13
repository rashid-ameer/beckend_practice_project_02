import { type CookieOptions, type Response } from "express";
import { NODE_ENV } from "../constants/env";

export const REFRESH_PATH = "/refresh";

interface SetAuthCookiesProps {
  res: Response;
  refreshToken: string;
}

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: NODE_ENV === "production",
  sameSite: "strict",
  expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Fixed: Changed * to + for correct date calculation
  path: REFRESH_PATH,
};

export const setAuthCookies = ({ res, refreshToken }: SetAuthCookiesProps) => {
  res.cookie("refreshToken", refreshToken, authCookieOptions);
  return res;
};
