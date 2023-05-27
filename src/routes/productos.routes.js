//Conexion con express y Router

const Router = require("express").Router;

//Middlewares Locales

const { checkUserLogged, userNotLogged , isValidToken , soloAdmins  } = require("../middlewares/auth.middlewares");

//Router

const router = Router();

//Controllers

const { getAllProductsController , getProductByIdController , postProductController , putProductByIdController , deleteProductByIdController } = require("../controllers/products.controller");

//Endpoints

router.get('/', getAllProductsController );

router.get('/:id', getProductByIdController );

router.post('/', postProductController );

router.put('/:id' , putProductByIdController ); 

router.delete('/:id' , deleteProductByIdController );

module.exports = { ProductsRouter: router  };