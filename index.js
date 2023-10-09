const {ApolloServer,gql} = require("apollo-server")


// instanciamos apolloserver a server para crearlo
const server = new ApolloServer()



server.listen().then(({url})=>{
    console.log("Servidor listo en la url " + url);
})