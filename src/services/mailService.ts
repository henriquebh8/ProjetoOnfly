import nodemailer, { Transporter } from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/config";

class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string): Promise<void> {
    const mailOptions = {
      from: EMAIL_USER,
      to: to,
      subject: subject,
      text: text,
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }
}

export default new MailService();
