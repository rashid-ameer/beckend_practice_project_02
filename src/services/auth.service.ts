import HTTP_CODES from "../constants/httpCodes";
import UserModel from "../models/user.model";
import ApiError from "../utils/apiError";

interface CreateUserParams {
  email: string;
  username: string;
  password: string;
}

export const createUser = async (data: CreateUserParams) => {
  // check if user already exists
  const existingUser = await UserModel.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(HTTP_CODES.CONFLICT, "Email already exists.");
  }
  // if not register the user
  const user = await UserModel.create(data);

  // send the response back
  return user.omitPassword();
};
