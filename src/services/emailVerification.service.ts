import EmailVerificationModel from "../models/emailVerification.model";

interface CreateEmailVerificationParams {
  code: string;
  userId: string;
  email: string;
  expiresAt: Date;
  createdAt: Date;
}

export const createEmailVerification = async (
  props: CreateEmailVerificationParams
) => {
  return EmailVerificationModel.create(props);
};
