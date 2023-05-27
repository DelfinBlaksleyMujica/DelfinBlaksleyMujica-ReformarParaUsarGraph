const { MensajesRepository } = require("./mensajes/mensajes.repository");
const { ProductosRepository } = require("./products/products.repository");
const { getDaos } = require("../daos/factory");
const { options } = require("../config/options");

const { mensajeDao } = getDaos( options.server.persistence );
const { productDao } = getDaos( options.server.persistence );

const MensajesService = new MensajesRepository( mensajeDao );
const rootGraphqlService = new ProductosRepository( productDao );

module.exports = { MensajesService , rootGraphqlService };