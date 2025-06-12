import { z } from "zod";

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email."),
  username: z
    .string({ required_error: "Username is required" })
    .min(3, "Username must be atleast 3 characters"),
  password: z
    .string({ required_error: "Password is required." })
    .min(5, "Password must be atleast 5 characters."),
});
