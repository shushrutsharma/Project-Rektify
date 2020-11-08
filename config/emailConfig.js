let nodemailer = require("nodemailer");
let transporter = nodemailer.createTransport({
  service: "gmail",
   //host: "webmail.hpcl.in",
  // port: 587,
  // secure: false, // true for 465, false for other ports

  //add email details here
  auth: {
    user: "", //emailID
    pass: "", //Password
  },
  tls: {
    rejectUnauthorized: false,
  },
});
module.exports = transporter;
