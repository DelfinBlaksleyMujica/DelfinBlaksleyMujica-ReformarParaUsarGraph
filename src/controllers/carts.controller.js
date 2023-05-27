//Servicios
const { CartService } = require("../services/carts.service");
const { ProductsService } = require("../services/products.service");

//Loggers

const { logger } = require("../loggers/loggers");

//Mensajeria

const { transporter , adminEmail } = require("../mensajeria/gmail");
const { adminWapp  , twilioClient , twilioWapp , twilioPhone } = require("../mensajeria/twilio");


//Funciones

const getAllCartsController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const carritos = await CartService.getCarts();
        if ( carritos.length == 0) {
            logger.info("No hay carritos para mostrar");
            return res.status(400).send({ message: "No hay carritos para mostrar"})
        } else {
            logger.info("Se muestran todos los carritos correctamente");
            return res.status(200).send({ carritos: carritos });
        }
        
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para traer carritos`)
        res.status(500).send({ message: error.message });
    }  
};

const postNewCartController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const nuevoCarrito = await CartService.saveNewCart();
        req.session.carrito = nuevoCarrito;
        logger.info(`Carrito nuevo agregado a la base de datos: ${ nuevoCarrito }`);
        return res.status(200).send( { carritoNuevo: nuevoCarrito } )
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para postear carrito`)
        res.status(500).send({ message : error.message })
    }
};

const deleteCartByIdController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const carrito = await CartService.getCartById( id );
            const deletedCart = await CartService.deleteCart( id );
            logger.info(`Se elimino correctamente el carrito "${carrito.id}" de la base de datos`);
            res.status(200).send({ deletedProduct: deletedCart })
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para borrar carrito por id`)
        res.status(500).send( { message: error.message } )
    }
};

const getProductsInCartController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const carrito = await CartService.getCartById( id );
            logger.info(carrito.productos);
            res.status(200).send( { productos: carrito.productos } )
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para traer productos de carrito`)
        res.status(500).send( { message: error.message } )
    }
};

const postProductInCartController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id } = req.params;
            const producto = await ProductsService.getProductById( id );
            req.session.carrito.productos.push(producto);
            logger.info( producto );
            const newProduct = await CartService.addProduct( producto )
            const newProductObj = JSON.stringify( newProduct)
            res.send({ producto: `Se agrego el producto ${ producto } al carrito` })
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para cargar producto en carrito`)
        res.status(500).send( { error: error.message } )
    }    
};

const confirmPurchaseController = async ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const productosEnCarrito = JSON.stringify(req.session.carrito.productos);
            //Envio de Mail
            const nuevoPedido = `
                <div>
                    <h1>¡Nuevo Pedido!</h1>
                    <h2>Se realizo un nuevo pedido</h2>
                    <h3>Los datos del pedido son los siguientes:</h3>
                    ${ productosEnCarrito }
                </div>`
            /*Estructura del correo*/
            const mailOptions = {
                from:"Activá E-Commerce",
                to: adminEmail,
                subject: `Nuevo Pedido de: ${ req.session.username } + ${ req.session.userName } `,
                html: nuevoPedido
            }
            await transporter.sendMail( mailOptions );
            //Envio de Whats App
            const infoWapp = await twilioClient.messages.create({
                from: twilioWapp,
                to: adminWapp,
                body: `Nuevo pedido de: ${ req.session.username } + ${ req.session.userName }. Se incluyen los siguientes productos: ${ productosEnCarrito } `
            });
            //Envio de mensaje al cliente
            const infoMensaje = await twilioClient.messages.create({
                from: twilioPhone,
                to: req.session.telefono,
                body:"El pedido fue recibido correctamente y se encuentra en proceso."
            })
            res.status(200).send( { productos: req.session.carrito.productos } )
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para enviar mensajes de confirmacion de compra`)
        res.status(500).send( { message: error.message } )
    }
};

const deleteProductFromCartController = async (req, res) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        if (req.params) {
            const { id , idProd } = req.params;
            const removedProd = await CartService.removeProduct( id , idProd );
            logger.info( removedProd );
            return res.status(200).send( { message: removedProd } )
        }
    } catch (error) {
        logger.error(`Error en el servidor para acceder a la ruta ${ method } ${ url } para borrar producto de carrito`)
        res.status(500).send( error.message );
    }
}


module.exports = { getAllCartsController , postNewCartController , deleteCartByIdController , getProductsInCartController , postProductInCartController , confirmPurchaseController , deleteProductFromCartController };

