const nodemailer = require("nodemailer");
require('dotenv').config();

const EMAIL_HOST_USER = process.env.EMAIL_HOST_USER;
const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;

const sendEmail = async (username, email, otp) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,           
            secure: true,        
            auth: {
                user: EMAIL_HOST_USER,
                pass: EMAIL_HOST_PASSWORD,
            },
            // Render par timeout aur network drops rokne ke liye yeh zaroori hai
            connectionTimeout: 10000, // 10 seconds timeout
            tls: {
                rejectUnauthorized: false // Cloud se bhejte waqt SSL errors ko ignore karne ke liye
            }
        });

        const info = await transporter.sendMail({
            from: EMAIL_HOST_USER,
            to: email,
            subject: "One-Time Password (OTP) Verification",
            text: `Hi ${username},\n\nHere is your verification code: ${otp}\n\nIf you did not request this, please ignore this email.`,
            html: `<p>Hi ${username},</p><p>Your verification code is: <strong>${otp}</strong></p>`
        });
        
        console.log("Email sent successfully: ", info.messageId);
        return info;
    } catch (err) {
        console.error("SendEmail error:", err);
        throw err;
    }
};

module.exports = sendEmail;
