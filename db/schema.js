const {ApolloServer,gql} = require("apollo-server")

//Definimos nuesto input con input y el nombre mas el valor que recibe 


//Schema
const typeDefs = gql`
    type Query{
        obtenerCursos:String
    }
`

module.exports = typeDefs