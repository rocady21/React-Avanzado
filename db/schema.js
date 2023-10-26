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

    type Pedido {
        id: ID,
        pedido: [PedidoGrupo],
        total: Float,
        cliente: ID,
        vendedor: ID,
        creado: String,
        estado: EstadoPedido
    }

    type PedidoGrupo {
        id: ID
        cantidad: Int
    }
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
    type TopClientes {
        total: Float
        cliente: [Cliente]
    }
    type TopVendedor {
        total: Float,
        vendedor: [Usuario]
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

    input PedidoProductoInput {
        id: ID,
        cantidad: Int
    }

    input PedidoInput {
        pedido: [PedidoProductoInput],
        total: Float,
        cliente: ID,
        estado: EstadoPedido
    }

    #Para decirle que el estado solo seran 3 lo hacemos con enum

    enum EstadoPedido {
        PENDIENTE
        COMPLETADO
        CANCELADO
    }

    type Query{
        #Usuario
        obtenerInfoByToken:Usuario,
        
        #Productos
        obtenerProductos:[Producto],
        obtenerProductoById(id: ID): Producto,

        #Clientes
        obtenerClientes : [Cliente]
        obtenerClientesVendedor:[Cliente]
        obtenerCliente(id : ID) : Cliente

        #Pedidos 
        obtenerPedidos : [Pedido]
        obtenerPedidosVendedor : [Pedido]
        obtenerPedido : Pedido


        mejoresClientes: [TopClientes],
        mejoresVendedores: [TopVendedor]
        buscarProductosPorNombre(texto : String!): [Producto]
    }


    type Mutation {
        #Usuario
        nuevoUsuario(input: inputUsuario): Usuario,
        loginUser(input: inputLogin): Token,
        
        #Productos
        nuevoProducto(input: ProductoInput): Producto,
        actualizarProducto(id:ID , input:ProductoInput): Producto,
        EliminarProducto(id: ID): String,

        #Clientes
        nuevoCliente(input: clienteInput):Cliente,
        actualizarCliente(id: ID , input: clienteInput):Cliente
        borrarCliente(id:ID): String

        #Pedidos
        nuevoPedido(input: PedidoInput) : Pedido
        actualiarPedido(id: ID, input: PedidoInput): Pedido
        obtenerPedidosByEstado(estado: String):[Pedido]
        eliminarPedido(id : ID) : String
        
    }
`

module.exports = typeDefs