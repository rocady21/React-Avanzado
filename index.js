const {ApolloServer} = require("apollo-server")
const typeDefs = require("./db/schema")
const resolvers = require("./db/resolvers")
const conectarDB = require("./config/config")

conectarDB()

// instanciamos apolloserver a server para crearlo
const server = new ApolloServer({typeDefs,resolvers})


server.listen().then(({url})=>{
    console.log("Servidor listo en la url " + url);
})