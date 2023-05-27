//Loggers
const { logger } = require("../../../loggers/loggers");

class MensajesManagerMongo {
    constructor( productsModel ) {
        this.coleccion = productsModel;
    }

    async listarAll() {
        const listado = await this.coleccion.find({})
        return listado;
    }

    async guardar( nuevoElem ){
        const elementoNuevo = new this.coleccion( {...nuevoElem , timestamp: Date()  } );
        const savedNewElement = await elementoNuevo.save();
        return savedNewElement;
    }

}

module.exports = { MensajesManagerMongo };