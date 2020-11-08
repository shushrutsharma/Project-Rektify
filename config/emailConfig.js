let nodemailer = require("nodemailer");
require('dotenv').config()
let transporter = nodemailer.createTransport({
  service: "gmail",
   //host: "webmail.hpcl.in",
  // port: 587,
  // secure: false, // true for 465, false for other ports

  //add email details here
  auth: {
    user: process.env.EMAIL_ADDR, //emailID
    pass: process.env.EMAIL_PASS, //Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
