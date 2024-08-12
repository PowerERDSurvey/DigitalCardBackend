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



const sendVerificationEmail = {
  sendInitialVerificationEmail: async (userId, email, token, collection) => {
    // var url = `${process.env.BaseURL}/resetpassword/${userId}/verify/${token}/${collection.password}`;
    var url = `${process.env.BaseURL}/resetpassword/${userId}/verify/${token}/password`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'DigitalCard Account Initial Verification',
      text: `Please verify your account by clicking the link: ${url}\n\n  One time password: ${collection.password}`,
    };
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      //console.log('Error sendVerificationEmail - ', error);
    }
  },
  sendVerificationEmail: async (userId, email, token, collection) => {
    var url = `${process.env.BaseURL}/user/${userId}/verify/${token}`;
    // const mailOptions = {
    //   from: process.env.EMAIL_USER,
    //   to: email,
    //   subject: 'DigitalCard Account Verification',
    //   text: `Please verify your account by clicking the link: ${url}\n\n USERNAME : ${collection.userName}\n `,
    // };
    // try {
    //   return await transporter.sendMail(mailOptions);
    // } catch (error) {
    //   //console.log('Error sendVerificationEmail - ', error);
    // }
    return url;
  },
  sendForgetPassEmail: async (userId, email, token) => {
    var url = `${process.env.BaseURL}/user/${userId}/passwordReset/${token}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'DigitalCard Account PasswordReset',
      text: `Please reset your password by clicking the link: ${url}`
    };
    try {
      return await transporter.sendMail(mailOptions);
    } catch (error) {
      //console.log('Error sendVerificationEmail - ', error);
    }
  },
}

module.exports = sendVerificationEmail;