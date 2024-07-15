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



const sendVerificationEmail = async (userId,email, token , collection) => {
  var url =  `${process.env.BaseURL}/user/${userId}/verify/${token}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'DigitalCard Account Verification',
    text: `Please verify your account by clicking the link: ${url}\n\n USERNAME : ${collection.userName}\n PASSWORD: ${collection.password}`,
  };
  try {
    return await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log('Error sendVerificationEmail - ', error);
  }
};

module.exports = sendVerificationEmail;