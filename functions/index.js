const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendContactEmail = onRequest({ cors: true }, async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const recipientsArray = process.env.EMAIL_RECIPIENTS ?
    process.env.EMAIL_RECIPIENTS.split(",").map((email) => email.trim()) :
    [];

  const { name, email, role, schoolName, schoolAddress, message } = req.body;

  if (!name || !email || !role || !schoolName || !schoolAddress || !message) {
    return res.status(400).send("Missing required fields");
  }

  const mailOptions = {
    from: `"Website Form" <${process.env.EMAIL_USER}>`,
    to: recipientsArray,
    subject: `[Inventor Pi] Contact Form Submitted by ${name}`,
    text: `
New Contact Form Submitted at https://inventorpi.com

Name: ${name}
Email: ${email}
Role: ${role}
School Name: ${schoolName}
School Address: ${schoolAddress}

Message:
${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).send({ success: true });
  } catch (error) {
    logger.error("Error sending email:", error);
    return res.status(500).send({ error: "Failed to send message" });
  }
});
