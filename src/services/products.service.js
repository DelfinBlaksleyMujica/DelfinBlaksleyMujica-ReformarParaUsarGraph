//Importo la capa de base de datos
const { getDaos } = require("../daos/factory");
const { options } = require("../config/options");
const { ProductoDTO } = require("../daos/dto/product.dto");

const { productDao } = getDaos( options.server.persistence );

class ProductsService{
    static async getProducts(){
        const productos = await productDao.listarAll();
        console.log("PRODUCTOS: " , productos );
        const productosDTO = productos.map( producto => new ProductoDTO( producto ) );
        return productosDTO;
    }

    static async getProductById( id ){
        const producto = await productDao.listar( id );
        const productoDTO = new ProductoDTO( producto );
        return productoDTO;
    }
    static async saveNewProduct( obj ){
        const newProduct = await productDao.guardar( obj );
        return newProduct;
    }

    static async updateProduct( id , newInfo ){
        const productoUpdated = await productDao.actualizar( id , newInfo );
        return productoUpdated;
    }
    
    static async deleteProduct( id ){
        const deletedProduct = await productDao.borrar( id );
        return deletedProduct;
    }
}

module.exports = { ProductsService };