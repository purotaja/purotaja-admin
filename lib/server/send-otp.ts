import { transporter } from "../nodemailer";

export const SendOtp = async (email: string, otp: string) => {
  const response = await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: email,
    subject: "OTP Verification",
    text: `Your OTP is ${otp}`,
    html: `<p>Your OTP is <b>${otp}</b></p>`,
  });

  if (response.messageId) {
    return true;
  }

  return false;
};
