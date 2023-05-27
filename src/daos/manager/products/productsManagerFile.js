const fs = require("fs");
const { options } = require("../../../config/options");

//Loggers
const { logger } = require("../../../loggers/loggers");

class ProductManagerFile {
    constructor(){
        this.ruta = options.filesystem.productsPath
    }

    listar( id ) {
        try{
            const leer = fs.readFileSync( this.ruta , "utf-8" );
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id)
            if (!obj) {
                logger.warn("No se encontro un item que haga match con el id solicitado");
                return null
            }
            return obj
        }
        catch(e){
            logger.error(e)
            return e.message;
        }
        
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

    actualizar( id ,  nuevoElem ) {
        try{
            const leer = fs.readFileSync( this.ruta , "utf-8");
            const data = JSON.parse(leer)
            let producto = nuevoElem
            const nuevoArray = data.filter( producto => producto.id != id);
            fs.writeFileSync( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            id = parseInt( id );
            nuevoArray.push({...producto , id })
            fs.writeFileSync( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
            logger.info(`Se actualizo el producto con id: ${id}`);
            return id
            
        }catch ( e ) {
            console.log(e);
        }
        
    }

    borrar( id ) {
        try{
            const leer = fs.readFileSync( this.ruta , "utf-8");
            const data = JSON.parse(leer)
            const obj = data.find(obj => obj.id == id);
            if( !obj ){
                return null;
            } else{
                const nuevoArray = data.filter( obj => obj.id != id );
                fs.writeFileSync( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8");
                return  JSON.stringify(obj)
            }
            
        } catch(e){
            logger.error(e);
            return e.message;
        }
    }

    borrarAll() {
        try{
            fs.writeFileSync( this.ruta , JSON.stringify([], null , 2) , "utf-8" )
            logger.info("Se borraron todos los productos del archivo correctamente");
        }catch ( e ){
            logger.error( e );
            return e.message;
        }
    }
}

module.exports = { ProductManagerFile };