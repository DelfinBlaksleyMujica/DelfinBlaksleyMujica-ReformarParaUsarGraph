const { ConnectDB } = require("../config/dbConnection");

const getDaos = ( persistencia ) => {
    let mensajeDao;
    let productDao;
    let cartDao;

    //Patron Factory
    switch ( persistencia ) {
    case "mongo":
        const DBconnection = ConnectDB.getInstance();
        
        const { ProductsManagerMongo } = require("./manager/products/productsManagerMongo");
        const { ProductosModel } = require("./dbModels/products.model")
        
        const { CartsManagerMongo } = require("./manager/carts/cartsManagerMongo");
        const { CarritosModel } = require("./dbModels/carts.model");

        const { MensajesManagerMongo } = require("./manager/mensajes/mensajesManagerMongo");
        const { MensajesModel } = require("./dbModels/mensajes.model");
        
        productDao = new ProductsManagerMongo( ProductosModel );
        cartDao = new CartsManagerMongo( CarritosModel );
        mensajeDao = new MensajesManagerMongo( MensajesModel );
        
        break;
    case "json":
        
        const { ProductManagerFile } = require("./manager/products/productsManagerFile");
        const { CartManagerFile } = require("./manager/carts/cartsManagerFile");
        const { MensajesManagerFile } = require("./manager/mensajes/mensajesManagerFile");

        productDao = new ProductManagerFile();
        cartDao = new CartManagerFile();
        mensajeDao = new MensajesManagerFile();
        
        
        break;
    }

    return { mensajeDao , productDao , cartDao };
}


module.exports = { getDaos };


