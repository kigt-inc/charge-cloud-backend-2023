import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import nodemailer from "nodemailer";
import { MailInterface } from "../types/mail";

export const sendEmail = async ({ to, subject, html, text }: MailInterface) => {
  try {
    // let account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const isVerified = await transporter.verify();
    if (!isVerified) return null;

    const info = await transporter.sendMail({
      from: `"Admin@KIGT" ${process.env.SMTP_EMAIL}`,
      to,
      subject,
      text,
      html,
    });

    transporter.close();
    return info;
  } catch (error) {
    console.log(error);
  }
};

export const sendForgotPasswordMail = async (
  email: string,
  reset_link_token: string,
  reset_link_expiry: string
) => {
  const filePath = path.join(__dirname, "../../templates/forgotPassword.html");
  const source = fs.readFileSync(filePath, "utf-8").toString();
  const template = handlebars.compile(source);
  let linkExpiry;

  if (reset_link_expiry.includes("m")) {
    linkExpiry = reset_link_expiry.replace("m", " minutes");
  } else if (reset_link_expiry.includes("d")) {
    linkExpiry = reset_link_expiry.replace("d", " days");
  } else {
    linkExpiry = reset_link_expiry + " " + "seconds";
  }

  const emailSended = await sendEmail({
    to: email,
    subject: "Forgot Password",
    html: template({ reset_link_token, linkExpiry }),
    text: "Forgot Password, A request to change your password was received.Use this reset link to change your password and log in",
  });

  return emailSended;
};
