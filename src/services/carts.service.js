//Importo la capa de base de datos
const { getDaos } = require("../daos/factory");
const { options } = require("../config/options");

const { cartDao } = getDaos( options.server.persistence );

class CartService{
    static async getCarts(){
        const carritos = await cartDao.listarAll();
        return carritos;
    }

    static async getCartById( id ){
        const carrito = await cartDao.listar( id );
        return carrito; 
    }

    static async saveNewCart(){
        const newCart = await cartDao.guardar();
        return newCart;
    }

    static async deleteCart( id ){
        const deletedCart = await cartDao.borrar( id );
        return deletedCart;
    }

    static async addProduct( obj ){
        const product = obj;
        return await cartDao.addProduct( product );
    }

    static async removeProduct( id , idProd ){
        const deletedProduct = await cartDao.deleteProdFromCart( id , idProd );
        return deletedProduct;
    }
}




module.exports = { CartService };