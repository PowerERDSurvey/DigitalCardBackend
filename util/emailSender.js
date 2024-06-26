const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});



const sendVerificationEmail = (userId,email, token) => {
  var url =  `${process.env.BaseURL}/user/${userId}/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Account Verification',
    text: `Please verify your account by clicking the link: ${url}`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendVerificationEmail;