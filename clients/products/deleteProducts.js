const axios = require("axios");

const url = "http://localhost:8080/api/productos";

const deleteProductsTest = async() => {
    try {
        setTimeout( async() => {
            //Agrego producto me fijo que el array length sea 1 , borro el producto con axios y vuevlo a chequear el array length, si es cero paso el test sino no lo paso
                console.log("Delete product test:");
                const newProduct = {
                    nombre: "Producto delete test",
                    descripcion: "Producto para prueba de delete product",
                    codigoDeProducto: 123456789,
                    precio: 1111,
                    thumbnail: "www.prueba-delete-product.com/thumbnail-prueba",
                    stock:1111
                };
                const response = await axios.post( url , newProduct );
                if ( response.data.status == "success" ) {
                    const results = await axios.get( url );
                    if ( results.data.data.length == 0 ) {
                        console.log("Delete test failed because of error in post product, get all products length equals cero");
                    } else {
                        const idProductoAborrar = results.data.data[0].id;
                        const deletedProduct = await axios.delete(`${ url }/${ idProductoAborrar }`);
                        // console.log( deletedProduct.data.status );
                        if ( deletedProduct.data.status == "success" ) {
                            console.log("Delete product test passed");
                        }else{
                            console.log("Delete product test failed");
                        }
                    }
            } else {
                console.log("Delete test failed while posting product");
            }
        }, 3000 );

    } catch (error) {
        console.log( "Error en el servidor: " , error.message );
    }
};

module.exports = { deleteProductsTest }