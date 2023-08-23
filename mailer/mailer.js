const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const email="thamboo20@outlook.com"
const password="yebudaman18"
// Create a transporter using your email service credentials
const transporter = nodemailer.createTransport({
  service: 'outlook',
  host: 'smtp.elasticemail.com',
  port: 2525,
  secure: true,
  // e.g., 'gmail'
  auth: {
    user: "aman23ca005@satiengg.in",
    pass: "3425B7B067EAC05A33C2400F0BEF11939D64"
  }
});

// Load the HTML email template
const emailTemplatePath = path.join(__dirname, 'email-template.html');
const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

// Function to send the email
const sendConfirmationEmail = async (user) => {
    const verificationLink = `http://127.0.0.1:9000/user/verify/${user._id}`;
    const emailContent = emailTemplate.replace('{{verificationLink}}', verificationLink);
  
    const mailOptions = {
      from: "aman23ca005@satiengg.in",
      to: user.email,
      subject: 'Confirm Your Email',
      html: emailContent
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true; // Successfully sent email
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
  
  };
  
  const sendResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: "aman23ca005@satiengg.in",
      to: user.email,
      subject: 'Password Reset',
      html: `Click <a href="${resetUrl}">here</a> to reset your password.`,
    };
  
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent:', info.response);
      return true; // Successfully sent email
    } catch (error) {
      console.error('Error sending email:', error);
      return false; // Failed to send email
    }
  };
  
  module.exports ={ sendConfirmationEmail,sendResetEmail};


