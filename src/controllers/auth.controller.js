//Servicios
const { UserModel } = require("../services/auth.service");

//Loggers
const { logger } = require("../loggers/loggers");

//Conexion con JWT
const jwt = require("jsonwebtoken");

//Funciones 
const getRegistroController = ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const errorMsg = req.session.messages ? req.session.messages[0] : "";
        /*res.render( "signup" , { error: errorMsg } );*/
        res.send({ message: errorMsg } )
        req.session.messages = [];
    } catch (error) {
        logger.error("Error en el get de registro");
        res.status(500).send({ message: error.message });
    }
};

const getInicioSesionController =  ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        /*res.render("login");*/
        res.send("Get de inicio de sesion");
    } catch (error) {
        logger.error("Error en el get de inicio de sesion");
        res.status(500).send({ message: error.message });
    }
};

const getLoginController = ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const errorMsg = req.session.messages ? req.session.messages[0] : "";
        /*res.render( "login" , { error: errorMsg } );*/
        res.send({ message: errorMsg })
        req.session.messages = [];
    } catch (error) {
        logger.error("Error en el get de login");
        res.status(500).send({ message: error.message });
    } 
};

const getLogoutController = ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`)
        req.session.destroy((error) => {
        if (error) {
            logger.error(error);
            /*res.redirect("/")*/
            res.send( { messsage: "No se cerro la sesión correctamente" } )
        } else {
            logger.info("Se cerro la sesion correctamente");
            /*res.render("logout")*/
            res.send( { message: "Se cerro la sesíon correctamente"})
        }
    })
    } catch (error) {
        logger.error(`Error en el servidor en la ruta ${method} ${url}`);
        res.send(`Error para acceder a la ruta ${ method } ${ url }`)
    }
};

const postSignup = async ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);        
        res.send("Usuario registrado")
    } catch (error) {
        logger.error("Error en el post del signup");
        res.status(500).send({ message: error.message });
    };
};

const postLoginController = async ( req , res ) => {
    const { url , method } = req;
    try {
        logger.info(`Ruta ${ method } ${ url } visitada`);
        const { username  } = req.body;
        req.session.username = username;
        const usuarioArr = await UserModel.find( { username : username });
        const usuarioObj = usuarioArr[0];
        const usuarioName = usuarioObj.name;
        const usuarioTel = usuarioObj.telefono;
        req.session.userName = usuarioName;
        req.session.telefono = usuarioTel;
        console.log( "Telefono usuario:" , usuarioTel )
        jwt.sign({ username: username } , "claveToken" , { expiresIn:"7d"} , ( error , token ) => {
            req.session.acces_token = token;
            logger.info(`Token de la session: ${ req.session.acces_token }` )
        });
        res.send({message:`Usuario autorizado: ${ username }`})
    } catch (error) {
        logger.error("Error en la autorizacion de ingreso de usuario");
        res.status(500).send({ message: error.message });
    }
};


module.exports = { getRegistroController ,getInicioSesionController , getLoginController , getLogoutController , postSignup , postLoginController , UserModel };