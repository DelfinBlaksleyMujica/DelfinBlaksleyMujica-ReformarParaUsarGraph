const supertest = require("supertest");
const chai = require("chai");
const { app } = require("../app");
const { ProductosModel } = require("../daos/dbModels/products.model");
const request = supertest( app );
const expect = chai.expect;

describe("api products test" , () => {
    
    afterEach( async()=>{
        console.log("Productos borrados de la base de datos after test");
        await ProductosModel.deleteMany({});
    });


    it("endpoint get products should return an empty array for products" , async() => {
        console.log("Prueba get");
        const response = await request.get("/api/productos");
        expect(response.statusCode).to.equal(404);
        expect(response.body.message).equal("No hay productos cargados en la base de datos");
    });

    it("after create a new product, i should get the new product posted", async()=>{
        console.log("Post product test")
        const newObject = {
            nombre: "Producto test",
            descripcion: "Producto para prueba de post product",
            codigoDeProducto: 123456789,
            precio: 1111,
            thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
            stock:1111
        };
        const response = await request.post("/api/productos").send(newObject);
        // // console.log(response)
        expect(response.status).to.equal(200);
        expect(response.body.message).equal("Producto agregado a la base de datos exitosamente");
        expect(response.body.data).to.haveOwnProperty("_id");
    });

    it("Put product" , async() => {
        console.log("Delete product test");
        const newObject = {
            nombre: "Producto test",
            descripcion: "Producto para prueba de post product",
            codigoDeProducto: 123456789,
            precio: 1111,
            thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
            stock:1111
        };
        const response = await request.post("/api/productos").send(newObject);
        const newIdCreated = response.body.data._id;
        const editedProduct = {
            nombre: "Producto test",
            descripcion: "Producto para prueba de post product",
            codigoDeProducto: 123456789,
            precio: 2222,
            thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
            stock:2222
        }
        const updateProduct = await request.put(`/api/productos/${ newIdCreated }`).send( editedProduct );
        expect(updateProduct.status).to.equal(200);
        expect(updateProduct.body.message).equal("Producto actualizado correctamente");
    });

    it("After delete a product, product array should be empty" , async() => {
        console.log("Delete product test");
        const newObject = {
            nombre: "Producto test",
            descripcion: "Producto para prueba de post product",
            codigoDeProducto: 123456789,
            precio: 1111,
            thumbnail: "www.prueba-post-product.com/thumbnail-prueba",
            stock:1111
        };
        const response = await request.post("/api/productos").send(newObject);
        const newIdCreated = response.body.data._id;
        console.log("NEW ID CREATED: " , newIdCreated);
        const deleteResponse = await request.delete(`/api/productos/${ newIdCreated }`);
        expect(deleteResponse.status).to.equal(200);
        expect(deleteResponse.body.mensaje).equal("Producto borrado correctamente");
        expect(deleteResponse.body.data).to.haveOwnProperty("_id");
    });
});