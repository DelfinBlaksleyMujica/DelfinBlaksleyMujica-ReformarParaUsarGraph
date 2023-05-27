const fs = require("fs");
const { options } = require("../../../config/options");

//Loggers
const { logger } = require("../../../loggers/loggers");

class MensajesManagerFile {
    constructor(){
        this.ruta = options.filesystem.mensajesPath
    }

    listarAll() {
        try {
            const leer = fs.readFileSync( this.ruta  , "utf-8" );
            return JSON.parse( leer )
        } catch (error) {
            logger.error(error.message);
        }
    }

    guardar( obj ) {
        try {
            const leer = fs.readFileSync( this.ruta , "utf-8" );
            const data = JSON.parse( leer );
            let id;
            data.length === 0
            ?
            (id = 1)
            :
            (id = data.length + 1);
            const newElement = {...obj , id , timestamp: Date() };
            data.push(newElement);
            fs.writeFileSync( this.ruta , JSON.stringify( data , null , 2 ) , "utf-8");
            logger.info("Se agrego el item correctamente");
            return newElement.id;
        }catch (e){
            logger.error(e);
            return e.message;
        }
    }

}

module.exports = { MensajesManagerFile };