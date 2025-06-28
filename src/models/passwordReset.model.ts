import mongoose, { type Document } from "mongoose";

interface PasswordResetDocument extends Document {
  email: string;
  userId: mongoose.Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

const passwordResetSchema = new mongoose.Schema<PasswordResetDocument>({
  email: {
    type: String,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const PasswordResetModel = mongoose.model<PasswordResetDocument>(
  "PasswordReset",
  passwordResetSchema,
  "password_reset"
);

export default PasswordResetModel;
