import mongoose, { type Document } from "mongoose";

interface EmailVerificaitonDocument extends Document {
  userId: mongoose.Types.ObjectId;
  code: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

const emailVerificaitonSchema = new mongoose.Schema<EmailVerificaitonDocument>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  code: {
    type: String,
    required: true,
  },
  email: {
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

const EmailVerificationModel = mongoose.model<EmailVerificaitonDocument>(
  "EmailVerificaiton",
  emailVerificaitonSchema,
  "email_verification"
);

export default EmailVerificationModel;
