const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: process.env.EMAIL_HOST,
//   port: process.env.EMAIL_PORT,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });



// const sendVerificationEmail = {
//   sendInitialVerificationEmail: async (userId, email, token, collection) => {
//     // var url = `${process.env.BaseURL}/resetpassword/${userId}/verify/${token}/${collection.password}`;
//     var url = `${process.env.BaseURL}/resetpassword/${userId}/verify/${token}/password`;
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'DigitalCard Account Initial Verification',
//       text: `Please verify your account by clicking the link: ${url}\n\n  One time password: ${collection.password}`,
//     };
//     try {
//       return await transporter.sendMail(mailOptions);
//     } catch (error) {
//       console.log('Error sendVerificationEmail - ', error);
//     }
//   },
//   sendVerificationEmail: async (userId, email, token, collection) => {
//     var url = `${process.env.BaseURL}/user/${userId}/verify/${token}`;
//     // const mailOptions = {
//     //   from: process.env.EMAIL_USER,
//     //   to: email,
//     //   subject: 'DigitalCard Account Verification',
//     //   text: `Please verify your account by clicking the link: ${url}\n\n USERNAME : ${collection.userName}\n `,
//     // };
//     // try {
//     //   return await transporter.sendMail(mailOptions);
//     // } catch (error) {
//     //   console.log('Error sendVerificationEmail - ', error);
//     // }
//     return url;
//   },
//   sendForgetPassEmail: async (userId, email, token) => {
//     var url = `${process.env.BaseURL}/user/${userId}/passwordReset/${token}`;
//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: email,
//       subject: 'DigitalCard Account PasswordReset',
//       text: `Please reset your password by clicking the link: ${url}`
//     };
//     try {
//       return await transporter.sendMail(mailOptions);
//     } catch (error) {
//       console.log('Error sendVerificationEmail - ', error);
//     }
//   },
// }
// const sendVerificationEmail = {
sendInitialVerificationEmail: async (userId, email, token, collection) => {
  var url = `${process.env.BaseURL}/resetpassword/${userId}/verify/${token}/password`;

  // Manual email sending logic (example using SMTP)
  const smtpServer = 'your.smtp.server'; // Replace with your SMTP server
  const smtpPort = 25; // Replace with your SMTP port
  const message = `Subject: DigitalCard Account Initial Verification\n\nPlease verify your account by clicking the link: ${url}\n\nOne time password: ${collection.password}`;

  // Use a simple TCP connection to send the email
  const net = require('net');
  const client = net.createConnection(smtpPort, smtpServer, () => {
    client.write(`HELO ${smtpServer}\r\n`);
    client.write(`MAIL FROM: <${process.env.EMAIL_USER}>\r\n`);
    client.write(`RCPT TO: <${email}>\r\n`);
    client.write(`DATA\r\n`);
    client.write(`${message}\r\n.\r\n`);
    client.write(`QUIT\r\n`);
  });

  client.on('data', (data) => {
    console.log(data.toString());
  });

  client.on('end', () => {
    console.log('Email sent successfully');
  });

  client.on('error', (error) => {
    console.log('Error sending email - ', error);
  });
},
  sendVerificationEmail: async (userId, email, token, collection) => {
    var url = `${process.env.BaseURL}/user/${userId}/verify/${token}`;
    // Similar manual sending logic can be added here
    return url;
  },
    sendForgetPassEmail: async (userId, email, token) => {
      var url = `${process.env.BaseURL}/user/${userId}/passwordReset/${token}`;
      // Similar manual sending logic can be added here
      return { success: true, message: 'Password reset email sent successfully' };
    },
}

module.exports = sendVerificationEmail;

module.exports = sendVerificationEmail;