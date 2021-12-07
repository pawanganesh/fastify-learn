require("dotenv").config();

const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendGridMail = async (toEmail, subject, textMessage) => {
    const msg = {
        to: toEmail,
        from: process.env.FROM_EMAIL,
        subject: subject,
        text: textMessage,
        // html: '<strong>Easy to do anywhere, even with Node.js</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent')
        })
        .catch((error) => {
            console.error(error)
        })
}

module.exports = { sendGridMail }