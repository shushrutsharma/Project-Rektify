var transporter = require("./config/emailConfig");

exports.sendMail = async (doubt) => {
    var mailid = doubt.email
    
        let info = await transporter.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: mailid, // list of receivers
            subject: "Doubt Resolved", // Subject line
            text: "Hello " + mailid, // plain text body
            html: "<b>Your doubt has been resolved</b>", // html body
          });
          console.log("Message sent: %s", info.messageId);
    
}