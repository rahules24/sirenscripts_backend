import { createTransport } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const contactEmail = createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*'); // Allow both origins
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests (OPTIONS)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    const { name, email, message, subject } = req.body;

    const mail = {
      to: process.env.EMAIL_USER,
      subject: subject || "No subject",
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
      replyTo: email,
    };

    try {
      await contactEmail.sendMail(mail);
      res.status(200).json({ code: 200, status: "Message Sent" });
    } catch (error) {
      res.status(500).json({ code: 500, message: "Error sending email", error: error.message });
    }
  } else {
    res.status(405).json({ code: 405, message: "Method not allowed" });
  }
}
