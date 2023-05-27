//Conexion con express y Router

const Router = require("express").Router;

//Process env
const { options } = require("../config/options");

//Middlewares Locales

const { checkUserLogged, userNotLogged , isValidToken } = require("../middlewares/auth.middlewares");

//Conexion con Passport

const passport = require("passport");

//Conexion con Estrategias de Passport

const LocalStrategy = require("passport-local").Strategy;

//Conexion con bycrypt

const bcrypt = require("bcrypt");


//Models

const { UserModel } = require("../daos/dbModels/user.model");

//Router

const router = Router();

//Mensajeria
/*Nuevo Registro por Gmail*/
const { transporter , adminEmail } = require("../mensajeria/gmail");

//Controllers

const { getRegistroController , getInicioSesionController , getLoginController , getLogoutController , postSignup , postLoginController } = require("../controllers/auth.controller");


//Serializacion

passport.serializeUser( ( user , done ) => {
    return done( null , user.id)
});

//Deserialializacion

passport.deserializeUser( ( id , done ) => {
    UserModel.findById( id , ( err , userDB) => {
        return done( err , userDB );
    })
});

//Estrategia para registrar usuarios

passport.use( "signupStrategy" , new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField:"email"
    },
    ( req , username , password , done ) => {
        console.log( "body" , req.body );
        //Verifico si el usuario ya existe en la DB
        UserModel.findOne({ username: username} , async ( err , userDB ) => {
            if(err) return done(err , false , { message: `Hubo un error al buscar el usuario ${err}`});
            if(userDB) return done( null , false , { message: "El usuario ya existe" } );
            //Si el usuario no existe lo creo en la DB
            const salt = Number( options.session.salt );
            const hashPassword = await bcrypt.hash( password , salt  );
            const newUser = {
                name: req.body.name,
                username: username,
                password: hashPassword,
                domicilio: req.body.domicilio,
                edad: req.body.edad,
                telefono: req.body.telefono,
                avatar: req.body.avatar
            };
            const newUserRegisteredEmail = `
                <div>
                    <h1>¡Nuevo Registro!</h1>
                    <h2>Se registro un nuevo usuario en la aplicación</h2>
                    <h3>Los datos del usuario son los siguientes:</h3>
                    <ul>
                        <li>Name:${ req.body.name }</li>
                        <li>Username:${ username }</li>
                        <li>Address:${ req.body.domicilio }</li>
                        <li>Age:${ req.body.edad }</li>
                        <li>Tel:${ req.body.telefono }</li>
                    </ul>
                </div>`
            /*Estructura del correo*/
            const mailOptions = {
                from:"Activá E-Commerce",
                to: adminEmail,
                subject: "Nuevo Registro",
                html: newUserRegisteredEmail
            }
            await transporter.sendMail( mailOptions );
            UserModel.create( newUser , ( err , userCreated ) => {
                if(err) return done( err , false , { message: "Hubo un error al crear el usuario" } )
                return done( null , false, { message: "Usuario creado" } );
            })
        })
    } 
));


passport.use("loginStrategy" , new LocalStrategy(
    {
        passReqToCallback: true,
        usernameField: "username"
    },
    ( req ,username , password , done ) => {
        UserModel.findOne( { username: username } , async ( err , userDB ) => {
            if( err ) return done( err , false , { message: `Hubo un error al buscar el usuario ${err}`});
            if( !userDB ) return done( null , false , { message: "El usuario no esta registrado" } );
            const validPassword = await bcrypt.compare( password , userDB.password );
            if ( validPassword === false ) return done( err , false , { message: "El usuario y la contraseña no coinciden con un usuario registrado"} );
            return done( null , userDB , { message: "El usuario esta ok"})
        })
    }
));



//Endpoints

/*GET*/

router.get("/registro" , userNotLogged , getRegistroController );

router.get("/inicio-de-sesion"  , userNotLogged , getInicioSesionController );

router.get("/login" , userNotLogged , getLoginController );

router.get("/logout" , getLogoutController);

/*POST*/

router.post("/signup" , passport.authenticate("signupStrategy" , {
    failureRedirect: "/registro",
    failureMessage: true 
    } ) , postSignup );

router.post("/login" , passport.authenticate("loginStrategy" , {
    failureRedirect: "/login",
    failureMessage: true
}) , postLoginController );



module.exports = { AuthRouter: router };