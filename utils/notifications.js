require('dotenv').config();
const { SENDGRID_API_KEY } = process.env;

const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(SENDGRID_API_KEY)

const sendNotification = async (email) => {

    const msg = {
        to: email, // Change to your recipient
        from: 'estani.pettigrew@gmail.com', // Change to your verified sender
        subject: 'Welcome to disneyApp',
        text: 'Thaks for subscribe',
        html: '<strong>WELCOME!</strong>',
    }
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent successfully')
        })
        .catch((error) => {
            console.error(error)
        })

}

module.exports = {
    sendNotification
}