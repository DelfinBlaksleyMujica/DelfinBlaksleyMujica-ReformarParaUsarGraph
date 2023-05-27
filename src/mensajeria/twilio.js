//Twilio
const twilio = require("twilio");

const { options } = require("../config/options");

//Credenciales para conectarme a los servicios de Twilio
const accountId= options.twilio.accountId;
const accountToken = options.twilio.accountToken;

//Cliente de Node 
const twilioClient = twilio( accountId , accountToken );

/*Whats App*/
const twilioWapp = options.twilio.Wapp;
const adminWapp = options.twilio.adminWapp;

/*Mensaje de Texto*/
const twilioPhone= options.twilio.phone;



module.exports = { twilioWapp , twilioPhone , adminWapp  , twilioClient }