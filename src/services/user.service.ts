import UserModel from "../models/user.model";

export const getUserById = async (id: string) => {
  const user = await UserModel.findById(id);
  return user === null ? user : user.omitPassword();
};
