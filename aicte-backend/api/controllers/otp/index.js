const nodemailer = require('nodemailer');
const { checkEmailForInstitute } = require('../institute/auth');

// Utility to generate OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();
// Email Template
const getOtpEmailTemplate = (otp) => `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="text-align: center; color: #4CAF50;">Your OTP Code</h2>
    <p>Dear User,</p>
    <p>We received a request to send an OTP to your email address. Use the following OTP to proceed:</p>
    <div style="text-align: center; margin: 20px;">
      <span style="display: inline-block; padding: 10px 20px; font-size: 24px; font-weight: bold; color: #fff; background-color: #4CAF50; border-radius: 5px;">
        ${otp}
      </span>
    </div>
    <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
    <p>Best Regards,<br/>Your Company</p>
  </div>
`;

const sendOtpEmail = async (req, res) => {
    let { email, user_type, } = req.body;
    if (user_type) {
        let t = await checkEmailForInstitute(email, user_type);
        if (t) {
            email = t
        }
        else email = undefined;
    }
    console.log(email)
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is required or No accounts found.' });
    }

    const otp = generateOTP();

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Or use another email provider like Outlook, Yahoo, etc.
        auth: {
            user: "sharmavipul01002@gmail.com", // Your email address
            pass: "bvjr tyll odcg ooqx", // Your email password or app password
        },
    });

    // Mail options
    const mailOptions = {
        from: `"AICTE APPROVAL PORTAL" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your OTP Code',
        html: getOtpEmailTemplate(otp),
    };

    try {
        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully',
            otp, // For testing purposes; remove this in production
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send OTP. Please try again.',
        });
    }
};

module.exports = {
    sendOtpEmail,
};
