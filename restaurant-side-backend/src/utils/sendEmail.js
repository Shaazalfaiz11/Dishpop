const nodemailer = require("nodemailer");

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for 587
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"DineAR App" <${process.env.SMTP_MAIL}>`,
      to: email,
      subject,
      html: message,
    });
  } catch (err) {
    console.error("Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;
