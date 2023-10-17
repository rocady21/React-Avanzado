const {ApolloServer} = require("apollo-server")
const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")
const conectarDB = require("./config/config")
const jwt = require("jsonwebtoken")
// para poder usar variables de entorno mediante env
require("dotenv").config({path: "variables.env"})

conectarDB()

// instanciamos apolloserver a server para crearlo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req})=> {
        const token = req.headers["authorization"] || ""
        console.log("xd");
        if( token ) {
            try {
                const usuario = jwt.verify(token,process.env.PALABRA_SECRET)

                return {
                    usuario
                }
            } catch (error) {
                console.log(error);
            }
        }
    }})


server.listen().then(({url})=>{
    console.log("Servidor listo en la url " + url);
})