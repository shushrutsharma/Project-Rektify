var transporter = require("./config/emailConfig");

exports.sendMail = async (doubt) => {
    var mailid = doubt.email
    var ques = doubt.doubt
    
        let info = await transporter.sendMail({
            from: '"Rektify 👻" <foo@example.com>', // sender address
            to: mailid, // list of receivers
            subject: "Doubt Resolved", // Subject line
            text: "Hello " + mailid, // plain text body
            html: `Dear user, Your question ${ques}, has been answered.`, // html body
          });
          console.log("Message sent: %s", info.messageId);
    
}