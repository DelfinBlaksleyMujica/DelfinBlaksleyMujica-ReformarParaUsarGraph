//Conexion con express y Router

const Router = require("express").Router;


//Middlewares Locales

const { checkUserLogged, userNotLogged , isValidToken , soloAdmins  } = require("../middlewares/auth.middlewares");

//Router

const router = Router();

//Controllers
const { getAllCartsController , postNewCartController , deleteCartByIdController , getProductsInCartController , postProductInCartController , confirmPurchaseController, deleteProductFromCartController  } = require("../controllers/carts.controller");

//Endpoints

router.get('/', getAllCartsController );

router.post('/', postNewCartController );


router.delete('/:id', deleteCartByIdController )

//--------------------------------------------------
// router de productos en carrito

router.get('/:id/productos', getProductsInCartController );

router.post('/:id/productos', postProductInCartController);

router.post("/checkout" , confirmPurchaseController );

router.delete('/:id/productos/:idProd', deleteProductFromCartController)


module.exports = { CarritosRouter: router  };