const { buildSchema } = require("graphql");
const { graphqlHTTP } = require("express-graphql");
const { rootGraphqlService } = require("../repositories/index");

//Schema de productos de graphQL

const schemaGraphQl = buildSchema(`
    type Product{
        _id: String,
        nombre: String,
        descripcion: String,
        codigoDeProducto: Int,
        precio:Int,
        thumbnail: String,
        stock: Int
    }

    input ProductInput {
        nombre: String,
        descripcion: String,
        codigoDeProducto: Int,
        precio:Int,
        thumbnail: String,
        stock: Int
    }

    type Query{
        getProducts: [Product],
        getProductById(id:String): Product
    }

    type Mutation{
        saveNewProduct(obj:ProductInput): Product,
        updateProduct(id:String , newInfo: ProductInput): Product,
        deleteProduct(id:String): Product
    }
`);

const graphqlController = () => {
    return graphqlHTTP({
        schema: schemaGraphQl,
        rootValue: rootGraphqlService,
        graphiql: true
    })
};

module.exports = { graphqlController };
