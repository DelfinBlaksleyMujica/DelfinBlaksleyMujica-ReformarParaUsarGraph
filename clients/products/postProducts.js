const axios = require("axios");

const url = "http://localhost:8080/api/productos";

const postProductTest = async() => {
    try {
        setTimeout( async() => {
            console.log("Post product test:");
            const newProduct = {
                nombre: "Producto test",
                descripcion: "Producto para prueba de post product",
                codigoDeProducto: 123456789,
                precio: 1111,
                thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
                stock:1111
            };
        const response = await axios.post( url , newProduct );
        if ( response.data.status === "success" ) {
                const results = await axios.get( url );
                if ( results.data.data.length == 0 ) {
                    console.log("Post product test failed");
                }else{
                    console.log("Post product test passed");
                    const idProductoAborrar = results.data.data[0].id;
                    const deletedProduct = await axios.delete(`${ url }/${ idProductoAborrar }`);
                }
        } else {
            console.log("Post product test failed, data status != success");
        }
        }, 1000 );
    } catch (error) {
        console.log("Error en el servidor: " , error.message );
    }
    
};

module.exports = { postProductTest };

