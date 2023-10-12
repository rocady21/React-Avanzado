const {ApolloServer,gql} = require("apollo-server")

//Definimos nuesto input con input y el nombre mas el valor que recibe 
// definir mutations

//Schema
const typeDefs = gql`
    type Usuario {
        id: ID
        nombre: String
        apellido: String
        email: String
        password: String
        creado: String
    },
    type Token {
        token: String
    }
    type Cliente {
        id: ID,
        nombre: String,
        apellido: String,
        empresa : String,
        email: String,
        telefono : String,
        vendedor : ID
    }
    input inputLogin {
        email: String
        password: String
    }
    input inputUsuario {
        nombre: String!
        apellido: String!
        email: String!
        password: String!
    }

    #Productos

    type Producto {
        id: ID
        nombre: String,
        existencia: Int,
        precio: Float,
        creado: String


    },

    input ProductoInput {
        nombre: String!,
        existencia: Int!,
        precio: Float

    }

    input clienteInput {
        nombre: String!,
        apellido: String!,
        empresa: String!,
        email: String!,
        telefono: String
    }

    type Query{
        #Usuario
        obtenerInfoByToken(token: String!):Usuario,

        #Productos
        obtenerProductos:[Producto]

    }


    type Mutation {
        #Usuario
        nuevoUsuario(input: inputUsuario): Usuario,
        loginUser(input: inputLogin): Token,
        
        #Productos
        nuevoProducto(input: ProductoInput): Producto,
        obtenerProductoById(id: ID): Producto,
        actualizarProducto(id:ID , input:ProductoInput): Producto,
        EliminarProducto(id: ID): String,

        #Clientes
        nuevoCliente(input: clienteInput):Cliente,
        actualizarCliente(input: clienteInput):Cliente
        borrarCliente(id:ID): String
    }
`

module.exports = typeDefs