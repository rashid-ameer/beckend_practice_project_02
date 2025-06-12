import { z } from "zod";

export const registerSchema = z.object(
  {
    email: z
      .string({ required_error: "Email is required." })
      .email("Invalid email."),
    username: z
      .string({ required_error: "Username is required" })
      .min(3, "Username must be atleast 3 characters"),
    password: z
      .string({ required_error: "Password is required." })
      .min(5, "Password must be atleast 5 characters."),
  },
  {
    required_error: "Provide all required fields in valid object.",
    invalid_type_error: "Request data must be a valid object",
  }
);

export const loginSchema = z.object(
  {
    email: z.string({ required_error: "Email is required." }),
    password: z.string({ required_error: "Password is required." }),
  },
  {
    required_error: "Provide all required fields in valid object.",
    invalid_type_error: "Request data must be a valid object",
  }
);
