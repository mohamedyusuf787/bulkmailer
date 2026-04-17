const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose');
const { pathToRegexp } = require('path-to-regexp');
require("dotenv").config();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected with mongodb");
  }).catch((err) => {
    console.log("Error connecting to mongodb:", err);
  })

// create schema for history collection
const historySchema = new mongoose.Schema({
  message: String,
  emails: [String],
  totalCount: Number,
  successCount: Number,
  failedCount: Number,
  status: String,
  sentAt: Date
});

// creating model for history collection 1-st param: name of model, 2- schema, 3- collection name
const History = mongoose.model("History", historySchema, "history");

const crendential = mongoose.model("crendential", {}, "bulkmail")

const attachment = path.join(__dirname, "assets", "Mohamed_Yusuf_React_Developer.pdf")
app.post("/sentmail", async (req, res) => {
  const { message, emails } = req.body;

  if (!Array.isArray(emails) || emails.length === 0) {
    return res.status(400).send("Invalid email list");
  }

  let successCount = 0;
  let failedCount = 0;

  const cleanEmails = emails.map(e =>
    typeof e === "string" ? e : e.email
  );

  try {
    const data = await crendential.find();

    if (!data.length) {
      return res.status(400).send("No email credentials found");
    }

    const user = data[0].toJSON().userid;
    const pass = data[0].toJSON().passkey;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
      }
    });

    await transporter.verify();

    for (let i = 0; i < cleanEmails.length; i++) {
      try {
        await transporter.sendMail({
          from: user,
          to: cleanEmails[i],
          subject: "Application for MERN Stack Developer - Mohamed Yusuf",
          text: `Subject: Application for React / MERN Stack Developer Role – Mohamed Yusuf | Fresher

Dear Hiring Manager,

I am writing to express my interest in the React / MERN Stack / Frontend Developer position at your organization. I am a fresher with hands-on experience in building full-stack web applications using React.js, Node.js, Express.js, and MongoDB.

I recently developed NovCart, a full-featured e-commerce platform built with React + Redux, Node + Express, MongoDB, and Firebase Authentication — covering product listing, search, cart, checkout, and user authentication. I also built CivicPulse, a civic complaint reporting platform (MERN + Tailwind + Redux Toolkit + Cloudinary + Recharts) currently live at civic-pulse-seven.vercel.app.

Key skills I bring:
• Frontend: React.js, Redux Toolkit, Tailwind CSS, HTML5, CSS3
• Backend: Node.js, Express.js, REST APIs
• Database: MongoDB, Mongoose
• Auth: Firebase Authentication, JWT
• Tools: Git, Postman, Vercel, Render

I am a quick learner, passionate about writing clean and scalable code, and eager to contribute to a product-focused engineering team. I have attached my resume for your review and would welcome the opportunity to discuss how I can add value to your team.

Thank you for your time and consideration.

Warm regards,
Mohamed Yusuf
MERN Stack Developer | Chennai
Portfolio: https://yusuf-blog-portfolio.vercel.app/
LinkedIn: https://www.linkedin.com/in/mohamed-yusuf-85702521b/
Phone: 6385417513`,
          attachments: [
            {
              filename: "Mohamed_Yusuf_React_Developer.pdf",
              path: attachment
            }
          ]
        });

        successCount++;
        console.log("email sent to:", cleanEmails[i]);

      } catch (err) {
        failedCount++;
        console.log("Error sending to:", cleanEmails[i], err.message);
      }
    }

    let status = "pending";

    if (successCount === cleanEmails.length) status = "completed";
    else if (successCount > 0) status = "partial";
    else status = "failed";

    const historyEntry = new History({
      message : message || "job application mail",
      emails: cleanEmails,
      totalCount: cleanEmails.length,
      successCount,
      failedCount,
      status,
      sentAt: new Date()
    });

    await historyEntry.save();

    if (successCount > 0) {
      return res.status(200).json({
        message: "Email process completed",
        successCount,
        failedCount,
        status
      });
    } else {
      return res.status(500).json({
        message: "All emails failed",
        successCount,
        failedCount,
        status
      });
    }

  }
  catch (error) {
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);
    console.error("STACK:", error.stack);

    return res.status(500).json({
      message: error.message
    });
  }
});

app.get("/history", async (req, res) => {
  try {
    const data = await History.find().sort({ sentAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.log("Error fetching history:", err);
    res.status(500).send("Failed to fetch history");
  }
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})

