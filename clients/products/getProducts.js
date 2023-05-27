const axios = require("axios");

const url = "http://localhost:8080/api/productos";

const getProductsTest = async() => {
    try {
        const newProduct = {
            nombre: "Producto test",
            descripcion: "Producto para prueba de get product",
            codigoDeProducto: 123456789,
            precio: 1111,
            thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
            stock:1111
        };
    const response = await axios.post( url , newProduct );
    if ( response.data.status === "success" ) {
        const result = await axios.get( url );
        console.log( "Get products test:" );
        if ( result.data.data.length == 0 ) {
            console.log("Get products test failed");
        } else {
            console.log("Get products test passed");
            const idProductoAborrar = result.data.data[0].id;
            const deletedProduct = await axios.delete(`${ url }/${ idProductoAborrar }`);
        }
    }
        
    } catch (error) {
        console.log("Error en la peticion: " , error.message );
    }
    
};

module.exports = { getProductsTest } ;