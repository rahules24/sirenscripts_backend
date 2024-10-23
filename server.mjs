import express from "express";
import cors from "cors";
import { createTransport } from "nodemailer";
import dotenv from 'dotenv';

dotenv.config();  // This loads the variables into process.env

// server used to send send emails
const app = express();
const router = express.Router();

// CORS configuration
app.use(cors({
  origin: 'https://rahules24.github.io/sirenscripts/', // Specify your frontend origin
}));

app.use(express.json());
app.use("/", router);
app.listen(5000, () => console.log("Server Running"));

const contactEmail = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

contactEmail.verify((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready to Send");
  }
});

router.post("/contact", (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const subject = req.body.subject;
  const mail = {
    to: process.env.EMAIL_USER,
    subject: `${subject}`,
    html: `<p>Name: ${name}</p>
           <p>Email: ${email}</p>
           <p>Message: ${message}</p>`,
           replyTo: email,
  };
  
  contactEmail.sendMail(mail, (error) => {
    if (error) {
      res.json(error);
    } else {
      res.json({ code: 200, status: "Message Sent" });
    }
  });
});
