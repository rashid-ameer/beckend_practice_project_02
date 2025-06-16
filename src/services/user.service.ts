import UserModel from "../models/user.model";

export const getUserById = async (id: string) => {
  return UserModel.findById(id);
};
