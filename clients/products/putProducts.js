const axios = require("axios");

const url = "http://localhost:8080/api/productos";

const putProductsTest = async() => {
    try {
        //Agrego un producto con axios, ese producto lo edito con el put de axios y despues comparo el objeto editado de la base de datos con el primer objeto que guarde, si las propiedades coinciden paso le test si no coincicden no pasa
        setTimeout( async() => {
            console.log("Put product test:");
            const newProduct = {
                nombre: "Producto delete test",
                descripcion: "Producto para prueba de delete product",
                codigoDeProducto: 123456789,
                precio: 1111,
                thumbnail: "www.prueba-put-product.com/thumbnail-prueba",
                stock:1111
            };
            const response = await axios.post( url , newProduct );
            if ( response.data.status === "success") {
                const results = await axios.get( url );
                    if ( results.data.data.length == 0 ) {
                        console.log("Delete test failed because of error in post product, get all products length equals cero");
                    } else {
                        const idProductoAEditar = results.data.data[0].id;
                        const editedProduct = await axios.put(`${ url }/${ idProductoAEditar }` , {
                            nombre: "Producto editado en PUT test",
                            descripcion: "descripcion editada en producto para prueba de PUT product",
                            codigoDeProducto: 123456789,
                            precio: 2222,
                            thumbnail: "www.prueba-put-product.com/thumbnail-prueba",
                            stock:2222
                        });
                        if ( (editedProduct.data.data.acknowledged == true) && (editedProduct.data.data.modifiedCount == 1) && (editedProduct.data.data.matchedCount == 1) ) {
                            console.log("Put product test passed");
                            const idProductoABorrar = results.data.data[0].id;
                            const deletedProduct = await axios.delete(`${ url }/${ idProductoABorrar }`);
                        } else {
                            console.log("Put product test failed");
                        }
                    }
            } else {
                console.log("Put Test failed in posting product");
            }
        }, 5000 );
    } catch (error) {
        console.log("Fallo el test de put products:" , error.message );
    }
};


module.exports = { putProductsTest };