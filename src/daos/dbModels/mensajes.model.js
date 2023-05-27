//Conexion a Mongoose para poder armar los esquemas

const mongoose = require("mongoose");


//Coleccion creada dentro de la DB de Mongo Atlas

const mensajesCollection = "mensajes";

const mensajesSchema = new mongoose.Schema({
    nombre:{ 
        type: String , 
        required: true 
    },
    timestamp:{ 
        type: String , 
        required: true 
    },
    mensaje:{ 
        type:String , 
        required: true 
    }
})

const   MensajesModel = mongoose.model( mensajesCollection , mensajesSchema  )

module.exports = { MensajesModel };