const EmailService = {
  sendEmail: async (to, subject, body) => {
    const nodemailer = require("nodemailer");

    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 587,
      auth: {
        user: "no-reply@flowerboy.app",
        pass: process.env.TITAN_MAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: '"Flower Boy" <no-reply@flowerboy.app>',
      to: to,
      subject,
      html: body,
    };

    return await transporter.sendMail(mailOptions);
  },
};
module.exports = EmailService;
