class ProductoDTO {
    constructor( producto ){
        this.id = producto._id
        this.nombre = producto.nombre;
        this.descripcion = producto.descripcion;
        this.precio = producto.precio;
        this.stock = producto.stock;
    }
}


module.exports = { ProductoDTO };