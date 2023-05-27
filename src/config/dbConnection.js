//Conexion a Mongoose
const mongoose = require("mongoose");

//Conexion a la info process.env
const { options } = require("./options");

//Loggers
const { logger } = require("../loggers/loggers");


class ConnectDB {
    static #instance;
    constructor(){
        mongoose.connect( options.mongo.url , options.mongo.options );
    }

    static async getInstance() {
        if ( ConnectDB.#instance ) {
            logger.info("Base de datos ya conectada");
            return ConnectDB.#instance;
        } else {
            this.#instance = new ConnectDB();
            logger.info("Base de datos conectada!!");
        }
    }
}

module.exports = { ConnectDB };