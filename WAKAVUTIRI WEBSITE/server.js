const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/appointment", async (req, res) => {
    try {
        const {
            fullName,
            phone,
            email,
            service,
            appointmentDate,
            message
        } = req.body;

        if (!fullName || !phone) {
            return res.status(400).json({
                success: false,
                message: "Full name and phone number are required."
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"Wakavuti Website" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: "New Wakavuti Appointment Request",
            html: `
                <h2>New Appointment Request</h2>
                <p><strong>Full Name:</strong> ${fullName}</p>
                <p><strong>Phone:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email || "Not provided"}</p>
                <p><strong>Service Needed:</strong> ${service || "Not specified"}</p>
                <p><strong>Preferred Date:</strong> ${appointmentDate || "Not selected"}</p>
                <p><strong>Message:</strong></p>
                <p>${message || "No message provided"}</p>
            `
        };


        console.log("Sending email...");

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            success: true,
            message: "Appointment request sent successfully."
        });

    } catch (error) {
        console.error("Email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send appointment request."
        });
    }
});

app.post("/api/chat-message", async (req, res) => {
    try {
        const { chatEmail, chatMessage } = req.body;

        if (!chatMessage) {
            return res.status(400).json({
                success: false,
                message: "Message is required."
            });
        }

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"Wakavuti Website Chat" <${process.env.EMAIL_USER}>`,
            to: process.env.RECEIVER_EMAIL,
            subject: "New Wakavuti Chat Message",
            html: `
                <h2>New Chat Message</h2>
                <p><strong>Email:</strong> ${chatEmail || "Not provided"}</p>
                <p><strong>Message:</strong></p>
                <p>${chatMessage}</p>
            `
        });

        res.status(200).json({
            success: true,
            message: "Message sent successfully."
        });

    } catch (error) {
        console.error("Chat email error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to send chat message."
        });
    }
});

app.listen(process.env.PORT, () => {
    console.log(`Wakavuti backend running on port ${process.env.PORT}`);
});