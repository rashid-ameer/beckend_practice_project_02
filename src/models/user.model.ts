import mongoose, { type Document } from "mongoose";
import { hashPassword, verifyPassword } from "../utils/argon";

interface UserDocument extends Document {
  email: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
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
