//Servicios
const { MensajesService } = require("../repositories/index");

//Loggers
const { logger } = require("../loggers/loggers");

const getAllMessagesController = async ( req , res ) =>{
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ url } ${ method } visitada`);
        let mensajes = await MensajesService.getMensajes();
        if ( mensajes.length == 0 ) {
            logger.warn("No hay mensajes cargados en la base de datos");
            return res.status(404).send({ message: "No hay mensajes cargados en la base de datos"})
        }else{
            logger.info("Se muestran todos los mensajes correctamente");
            return res.status(200).send({ mensajes: mensajes });
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para traer mensajes`)
        res.status(500).send({ message: error.message });
    }
};

const postMessageController = async ( req ,res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ method } visitada`);
        if (req.body.mensaje) {
            const mensaje = {
                nombre: req.session.username,
                mensaje: req.body.mensaje
            };
            const nuevoMensaje = await MensajesService.saveMensaje( mensaje );
            logger.info(`Mensaje nuevo agregado a la base de datos: ${ nuevoMensaje }`);
            return res.status(200).send( { mensajeNuevo: nuevoMensaje } )
        } else {
            logger.warn("No se completo toda la informacion del mensaje para poder cargarlo");
            res.status(200).send({ message:"Debe completar toda la informacion del mensaje para poder cargarlo" })
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url }, no se pudo agregar el mensaje a la base de datos`)
        res.status(500).send({ message : error.message })
    }
} 

module.exports = { getAllMessagesController , postMessageController };