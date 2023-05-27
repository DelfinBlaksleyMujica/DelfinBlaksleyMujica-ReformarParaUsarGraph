//Servicios
const { ProductsService } = require("../services/products.service");

//Loggers
const { logger } = require("../loggers/loggers");


const getAllProductsController = async ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        let productos = await ProductsService.getProducts();
        if ( productos.length == 0 ) {
            logger.warn("No hay productos cargados en la base de datos");
            return res.status(404).send({ message: "No hay productos cargados en la base de datos"})
        }else{
            logger.info("Se muestran todos los productos correctamente");
            return res.status(200).send({ status: "success" , data: productos , message:"Todos los productos traidos correctamente" });
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para traer productos`)
        res.status(500).send({ message: error.message });
    } 
};

const getProductByIdController = async (req, res) => {
    const { url , method } = req;
    try{
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const producto = await ProductsService.getProductById( id );
            if ( producto == null ) {
                logger.warn("No existe producto con tal id en la base de datos");
                return res.status(404).send({ message: "No se encontro producto con tal id en la base de datos"});
            }else{
                logger.info(`Se trajo correctamente el producto con id: ${ id }`);
                return res.status(200).send({ producto : { producto }}) 
            }
        }
    }catch ( error ) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } no se pudo traer producto por id`)
        res.status(500).send({ message : error.message })
    }
};

const postProductController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.body.nombre &&  req.body.descripcion && req.body.codigoDeProducto && req.body.precio && req.body.thumbnail && req.body.stock) {
            const prodBody = req.body;
            const nuevoProd = await ProductsService.saveNewProduct( prodBody );
            logger.info(`Producto nuevo agregado a la base de datos: ${ nuevoProd }`);
            return res.status(200).send( { status:"success", data: nuevoProd  , message:"Producto agregado a la base de datos exitosamente"} )
        }else{
            logger.warn("No se completo toda la informacion del producto para poder cargarlo");
            res.status(200).send({ message:"Debe completar toda la informacion del producto para poder cargarlo" })
        }
    }catch ( error ) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url }, no se pudo agregar el producto a la base de datos`)
        res.status(500).send({ message : error.message })
    }  
};

const putProductByIdController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const { nombre , descripcion , codigoDeProducto , precio , thumbnail , stock } = req.body;
            const infoUpdatedProduct = {
                nombre: nombre,
                descripcion: descripcion, 
                codigoDeProducto: codigoDeProducto,
                precio: precio,
                thumbnail: thumbnail,
                stock: stock
            }
            const productUpdated = await ProductsService.updateProduct( id , infoUpdatedProduct )
            logger.info("Producto actualizado");
            res.status(200).send( { status:"success" ,  data: productUpdated , message:"Producto actualizado correctamente" } )
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url }, no se actualizo el producto`)
        res.status(500).send( { message: error.message } )
    }
};

const deleteProductByIdController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const deletedProduct = await ProductsService.deleteProduct( id );
            if (deletedProduct == null) {
                logger.warn("No hay producto con dicho id en la base de datos");
                return res.status(404).send({ message: "No se elimino el producto ya que no se encontro en la base de datos" })
            } else {
                logger.info(`Producto correctamente eliminado de la base de datos: "${deletedProduct}"`);
                return res.status(200).send({ status:"success" , data: deletedProduct , mensaje:"Producto borrado correctamente" })
            }
            
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url }, no se elimino el producto`)
        res.status(500).send( { message: error.message } )
    }
};

module.exports = { getAllProductsController , getProductByIdController , postProductController , putProductByIdController , deleteProductByIdController };