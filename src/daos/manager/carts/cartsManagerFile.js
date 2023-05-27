const fs = require("fs");
const { options } = require("../../../config/options");

//Loggers

const { logger } = require("../../../loggers/loggers");


class CartManagerFile {
    constructor() {
        this.ruta = options.filesystem.cartsPath;
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
            const leer = fs.readFileSync( this.ruta , "utf-8" );
            return JSON.parse( leer )
        } catch (error) {
            logger.error(error);
            return error.message
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
            const newElement = {...obj , id , timestamp: Date() , productos:[] };
            data.push(newElement);
            fs.writeFileSync( this.ruta , JSON.stringify( data , null , 2 ) , "utf-8");
            logger.info("Se agrego el Carrito correctamente");
            return newElement.id;
        }catch (e){
            logger.error(e);
            return e.message;
        }
    }
    

    addProduct( producto ) {
        try {
            const leer = fs.readFileSync( this.ruta , "utf-8" );
            const data = JSON.parse( leer );
            logger.info(producto);
            const cantidadDeCarts = data.length;
            logger.info(cantidadDeCarts);
            const cartId = cantidadDeCarts;
            logger.info(cartId);
            const carrito = data.find( carrito => carrito.id == cartId );
            logger.info(carrito);
            carrito.productos.push(producto);
            fs.writeFileSync( this.ruta , JSON.stringify( data , null , 2 ) , "utf-8");
            logger.ionfo("Se agrego el producto al carrito correctamente");
            return producto
        } catch (error) {
            console.log(error);
            return error;
        }
    }

    deleteProdFromCart( id , idProd ) {
        try {
            const leer = fs.readFileSync( this.ruta , "utf-8" );
            const data = JSON.parse( leer )
            let carrito = data.find( carrito => carrito.id == id )
            if (carrito == null) {
                logger.warn("No existe un carrito con ese id");
                return `No se encontro un carrito con id: ${ id }`;
            } else {
                let prodEnCart = carrito.productos.find( producto => producto.id == idProd )
                if ( prodEnCart == null) {
                    logger.warn(`No hay producto con dicho id de producto en el carrito con id: ${ id }`);
                    return `No hay producto con dicho id de producto en el carrito con id: ${ id } `
                } else {
                let productosModificados = carrito.productos.filter( producto => producto.id != idProd );
                console.log(productosModificados);
                carrito = {
                    productos: productosModificados,
                    id: parseInt(id),
                    timestamp: Date()
                } 
                const nuevoArray = data.filter( carrito => carrito.id != id );
                fs.writeFileSync( this.ruta , JSON.stringify(nuevoArray , null , 2 ) , "utf-8" )
                nuevoArray.push( carrito )
                fs.writeFileSync( this.ruta , JSON.stringify( nuevoArray , null , 2 ) , "utf-8" )
                logger.info("Se borro el producto con id: " + idProd + " del carrito con id: " + id );
                return `Se borro el producto con id: ${ idProd } del carrito con id: ${ id }`
                }
            }
        } catch (error) {
            logger.error(error);
            return error.message
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
            logger.error(e);
            return e.message
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

}

module.exports = { CartManagerFile };