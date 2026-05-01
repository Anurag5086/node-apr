const nodemailer = require('nodemailer');

function createTransporter() {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
        throw new Error(
            'Email is not configured: set GMAIL_USER and GMAIL_PASS (use a Gmail App Password).'
        );
    }
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
        },
    });
}

/**
 * Sends OTP email. Returns true on success, false on failure (logs error).
 */
const sendEmailForOtp = async (email, otp) => {
    try {
        const transporter = createTransporter();
        const fromUser = process.env.GMAIL_USER;

        const mailOptions = {
            from: `"Shop" <${fromUser}>`,
            to: email,
            subject: 'OTP for Email Verification',
            text: `Your OTP for email verification is: ${otp}`,
        };

        await transporter.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.error('[sendEmailForOtp]', error.message);
        return false;
    }
};

module.exports = sendEmailForOtp;
