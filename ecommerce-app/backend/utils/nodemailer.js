const nodemailer = require('nodemailer');

const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // TLS
        secure: false, // false for 587
        auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
        }
    });
};

const sendEmailForOtp = async (email, otp) => {
    const transporter = createTransporter();

     const mailOptions = {
        from: '"E-commerce App" <anurag23816@gmail.com>',
        to: email,
        subject: 'OTP for Email Verification',
        text: `Your OTP for email verification is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email: ' + error.message);
            return false;
        }
        console.log('Message sent: %s', info.messageId);
        return true;
    });
}

module.exports = sendEmailForOtp;