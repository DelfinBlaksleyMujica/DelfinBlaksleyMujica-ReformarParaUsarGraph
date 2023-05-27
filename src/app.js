//Conexion de Servidor 

const express = require("express");
const { options } = require("./config/options");
const app = express();
const httpServer = require("http").Server(app);
const io = require("socket.io")(httpServer);
const PORT = options.server.PORT;

//Conexion a la base de datos

const { ConnectDB } = require("./config/dbConnection");
const DBconnection = ConnectDB.getInstance();

//Compresion GZIP

const compression = require("compression");
app.use(compression());

//Loggers

const { logger } = require("./loggers/loggers");

//Cluster

const cluster = require("cluster");
const os = require("os");
const numCores = os.cpus().length;

//Conexion con routers

const { AuthRouter } = require("./routes/auth.routes");
const { ProductsRouter } = require("./routes/productos.routes");
const { CarritosRouter } = require("./routes/carritos.routes");
const { MessageRouter } = require("./routes/mensajes.routes");
const { graphqlController } = require("./controllers/products.graphql.controller");

//Conexion de Sessions

const session = require("express-session");
const cookieParser = require("cookie-parser");

//Conexion con Middleware de Autenticacion Passport

const passport = require("passport");

//Conexion con Base de datos

const MongoStore = require("connect-mongo");

//Configuracion de la session

app.use(cookieParser());



//Modo Cluster o Fork

if ( options.server.MODO === "CLUSTER" && cluster.isPrimary ) {
    
    for (let i = 0; i < numCores; i++) {
        cluster.fork();
    }

    cluster.on( "exit", ( worker ) => {
        console.log(`Proceso ${ worker.process.pid } murio`);
        cluster.fork();
    });
    
} else {

    //Conexion del servidor

    const server = httpServer.listen( PORT , () => {
        logger.info( `Server listening on port ${ server.address().port } on process ${ process.pid }` );
    });
    server.on( "error" , error => logger.info(`Error en el servidor: ${error}` ) );

    //Interpretacion de formatos

    app.use( express.json() );
    app.use( express.urlencoded( { extended: true } ) );

    //Sessions

    app.use(session({
        store: MongoStore.create({
            mongoUrl: options.mongo.url,
            ttl:600
        }),
        secret: options.session.secret,
        resave: true,
        saveUninitialized: true
    }));

    //Configuracion de Passport

    app.use( passport.initialize() );
    app.use( passport.session() );
    
    //Routes

    app.use( "/api/auth" , AuthRouter );
    app.use( "/api/productos" , ProductsRouter );
    app.use( "/api/carritos" , CarritosRouter );
    app.use("/api/mensajes" , MessageRouter );
    app.use("/api/graphql" , graphqlController() );

    //Desvio de rutas no encontradas

    app.get('*', (req, res) => {
        const { url, method } = req
        logger.warn(`Ruta ${method} ${url} no implementada`);
        res.send(`Ruta ${method} ${url} no está implementada`);
    });
};

module.exports = { app };


