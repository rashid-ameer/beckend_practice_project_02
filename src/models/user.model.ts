import mongoose, { type Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/argon";

interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword: (value: string) => Promise<boolean>;
  omitPassword: () => Omit<UserDocument, "password">;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hashPassword(this.password);
  }
});

userSchema.methods.comparePassword = async function (password: string) {
  return verifyPassword(this.password, password);
};

userSchema.methods.omitPassword = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
