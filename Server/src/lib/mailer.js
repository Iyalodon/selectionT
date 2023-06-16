const nodemailer = require("nodemailer");

//transport menghubungkan email pengirim/sender ke nodemailer
const transport = nodemailer.createTransport({
  auth: {
    user: process.env.nodemailer_email,
    pass: process.env.nodemailer_pass,
  },
  host: "smtp.gmail.com",
});

const mailer = async ({ subject, html, to, text }) => {
  await transport.sendMail({
    subject: subject || "testing kirim email",
    html: html || "",
    to: to || "ignoblessing@gmail.com",
    text: text || "halo ini dari nodemailer",
  });
};

module.exports = mailer;
