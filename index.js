const {ApolloServer} = require("apollo-server")
const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")
const conectarDB = require("./config/config")
const jwt = require("jsonwebtoken")
const Clientes = require("./Models/Clientes")
const Usuario = require("./Models/Usuario")
// para poder usar variables de entorno mediante env
require("dotenv").config({path: "variables.env"})

conectarDB()

// instanciamos apolloserver a server para crearlo
const server = new ApolloServer({
    typeDefs,
    resolvers,
    context:async({req})=> {
        const token = req.headers["authorization"] || ""
        if( token ) {
            try {
                const us = jwt.verify(token,process.env.PALABRA_SECRET)
                const usuario = await Usuario.findOne({_id:us.id})
            
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