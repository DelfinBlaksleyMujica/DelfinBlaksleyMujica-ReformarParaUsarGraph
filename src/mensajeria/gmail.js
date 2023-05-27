//NodeMailer
const nodemailer = require("nodemailer");

const { options } = require("../config/options");

//Credenciales del correo

const adminEmail = options.nodemailer.adminEmail;
const adminPassEmail = options.nodemailer.adminPassEmail;

//Configurl el canal para realizar el envio de mensajes
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: adminEmail,
        pass: adminPassEmail
    },
    secure:false,
    tls:{
        rejectUnauthorized: false
    }
});

module.exports = { transporter , adminEmail }