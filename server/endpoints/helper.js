const sgMail = require('@sendgrid/mail')

module.exports.sendEmail = async (emailReceiver, subject, htmlContent)=>{
    sgMail.setApiKey(process.env.SENDGRID_KEY);

    const email = {
        from: "mohamadmourad511@gmail.com",
        to: emailReceiver,
        subject,
        html: htmlContent,
      };
  
    await sgMail.send(email);
}