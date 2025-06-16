import jwt, { JsonWebTokenError } from "jsonwebtoken";

export interface AccessTokenPayload {
  id: string;
}

export interface RefreshTokenPayload {
  id: string;
}

export const verifyJWT = <T>(token: string, secret: string) => {
  try {
    const payload = jwt.verify(token, secret) as T;
    return { payload };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      return { error };
    }
    return { error: "Failed to verify jwt." };
  }
};
