import resend from "../config/resend";
import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

interface SendEmailParams {
  to: string;
  subject: string;
  text: string;
  html: string;
}

const getFromEmail = () =>
  NODE_ENV === "development" ? "Rashid <onboarding@resend.dev>" : EMAIL_SENDER;

const getToEmail = (to: string) =>
  NODE_ENV === "development" ? "delivered@resend.dev" : to;

const sendEmail = ({ to, subject, text, html }: SendEmailParams) => {
  return resend.emails.send({
    from: getFromEmail(),
    to: getToEmail(to),
    subject,
    html,
    text,
  });
};

export default sendEmail;
