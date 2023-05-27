class ProductosRepository {
    constructor( dao ) {
        this.dao = dao;
    }

    async getProducts() {
        const productos = await this.dao.listarAll();
        return productos;
    }

    async getProductById({ id }){
        const producto = await this.dao.listar( id );
        return producto;
    }

    async saveNewProduct({ obj }){
        const newProduct = await this.dao.guardar( obj );
        return newProduct;
    }

    async updateProduct({ id , newInfo }){
        const productoUpdated = await this.dao.actualizar( id , newInfo );
        return productoUpdated;
    }
    
    async deleteProduct({ id }){
        const deletedProduct = await this.dao.borrar( id );
        return deletedProduct;
    }
}

module.exports = { ProductosRepository };