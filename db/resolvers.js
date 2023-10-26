const Usuario = require("../Models/Usuario")
const Clientes = require("../Models/Clientes")
const Productos = require("../Models/Productos")
const Pedido = require("../Models/Pedido")

const bcryptjs = require("bcryptjs")
// para importar las variables de entorno
require("dotenv").config({path: "variables.env"})
const jwt = require("jsonwebtoken")
// los resolvers generalemnte retornan funciones


// funcion para crear token

const createToken = (usuario,secret,expiresIn) => {

    // al payload seria la info que necesita la cabezera para firmarlo}
    const {id,nombre,email,apellido} = usuario
    const paylaod = {
        id,
        email,
        nombre,
        apellido
    }

    // para firmar un nuevo token
    return jwt.sign(paylaod,secret,{expiresIn})
}

//Resolvers
const resolvers = {
    Query:{
        obtenerInfoByToken:async(_,{},ctx)=>  {
            return ctx.usuario
        },
        obtenerProductos:async()=> {
            try {
                const productos = await Productos.find() 

                return productos
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientes:async()=> {
            try {
                const clients = await Clientes.find()

                return clients
                
            } catch (error) {
                console.log(error);
            }
        },
        obtenerClientesVendedor:async(_,{},ctx)=> {
            // Esta funcion necesita mandar el token del usuario que este autenticado
            console.log(ctx);
            console.log("CTX");
            try {
                const clients = await Clientes.find({vendedor:ctx.usuario.id})
                console.log(clients);
                console.log("Clientes");
                return clients
                
            } catch (error) {
                console.log(error);
            }
        },
        obtenerCliente:async(_,{id},ctx)=> {

            // Esta funcion necesita mandar el token del usuario que este autenticado
            const cliente = await Clientes.findOne({_id:id})

            if(!cliente) {
                throw new Error("El cliente no existe")
            }

            // para que el usuario solo pueda acceder a sus clientes
            return cliente
        },
        //Pedidos
        obtenerPedidos:async()=> {
            try {
                const pedidos = await Pedido.find()
                
                return pedidos
            } catch (error) {
                
            }
        },
        obtenerPedidosVendedor:async(_,{},ctx)=> {
            try {
                // Esta funcion necesita mandar el token del usuario que este autenticado
                const pedidos = await Pedido.find({vendedor: ctx.usuario.id})
                
                return pedidos
            } catch (error) {
                console.log("error");
            }
        },
        obtenerPedido:async(_,{id},ctx)=> {
            try {
                // verificar si el pedido existe
                const pedido = await Pedido.find({_id:id})

                if(!pedido) {
                    throw new Error("Error, el pedido con existe")
                }
                // solo quien lo creo puede acceder al mismo 
                if(pedido.vendedor.toString() !== ctx.usuario.id) {
                    throw new Error("Error, solo quien creo el pedido puede acceder al mismo")
                }
                // retornar el resultado
                return pedido
            } catch (error) {
                console.log(error);
            }
        },

        // querys avanzadas
        mejoresClientes:async(_,{},ctx)=> {
            try {
                const clientes = await Pedido.aggregate([
                    {$match : {estado: "COMPLETADO"}},
                    // para agrupar los pedidos por id y sumar los totales
                    {$group : {
                        _id : "$cliente",
                        total: {$sum : "$total"}
                    }},
                    // lookup seria como un join
                    {
                        $lookup: {
                            from: "cleintes",
                            localField: "_id",
                            foreignField: "_id",
                            as: "cliente"
                        }
                    }
                ])

                return clientes
            } catch (error) {
                console.log(error);
            }
        },
        obtenerProductoById:async(_,{id},ctx)=> {
            try {
                const producto = await Productos.findOne({_id:id})
                if(producto.nombre){
                    return producto
                }
                throw new Error("Error, el producto no existe")
                
            } catch (error) {
                console.log(error);
            }
        },
        mejoresVendedores:async()=> {
            const vendedores = await Pedido.aggregate([
                {$match : {estado : "COMPLETADO"}},
                {$group : {
                    _id : "vendedor",
                    total: {$sum : "$total"}
                }},
                {
                    $lookup: {
                        from: "usuarios",
                        localField: "_id",
                        foreignField:"_id",
                        as: "vemdedor"
                    }
                }
            ])
        },
        buscarProductosPorNombre:async(_,{texto},ctx)=> {
            const productos = await Productos.find({$text: {$search: texto} })

            return productos
        }
        
        
    },
    Mutation: {
        nuevoUsuario:async(_,{input},ctx)=> {

            // Revisamos si el user esta registrado
            const {email,password} = input
            const existUser = await Usuario.findOne({email})
            if(existUser) {
                throw new Error("El usuario ya esta registrado")
            }

            // Hashear la password
            const salt = await bcryptjs.genSalt(10)
            input.password = await bcryptjs.hash(password,salt)

            try {
                // Crear usuario en la base de datos
                const usuario = new Usuario(input)
                usuario.save()
                return usuario
            } catch (error) {
                console.log(error);
            }

        },
        loginUser:async(_,{input},ctx)=> {
            const {email,password} = input

            const userExist = await Usuario.findOne({email})
            if(!userExist) {
                throw new Error("No hay ningun usuario con esas credenciales")
            }
            // revalidar si el password es correcto 
            const passwordCorrect = await bcryptjs.compare(password,userExist.password)
            if(!passwordCorrect) {
                throw new Error("Contraseña incorrecta")
            }

            return {
                token: createToken(userExist,process.env.PALABRA_SECRET,"24h")
            }
        },
        nuevoProducto:async(_,{input},ctx)=> {
            try {
                const Producto = new Productos(input)

                const resultado = await Producto.save()
    
                return resultado
            } catch (error) {
                console.log(error);
            }

        },
        actualizarProducto:async(_,{id,input},ctx)=> {
            try {
                let producto = await Productos.findOne({_id:id})
                if(!producto){
                    throw new Error("No existe el producto")
                }

                // {new: true} devuelve el producto actualizado
                producto = await Productos.findOneAndUpdate({_id:id},input,{new: true})
    
                return producto
            } catch (error) {
                console.log(error);
            }
        },
        EliminarProducto:async(_,{id},ctx)=> {
            try {
                let producto = await Productos.findOne({_id:id})
                if(!producto){
                    throw new Error("No existe el producto")
                }
                // Borra un producto siempre referenciando al modelo
                await Productos.findOneAndDelete({_id:id})

                return "Se elimino correctamente"
                
            } catch (error) {
                console.log(error);
            }
        },
        nuevoCliente:async(_,{input},ctx)=> {
            try {
                // Esta funcion necesita mandar el token del usuario que este autenticado
                const {email} = input
                const clientExist = await Clientes.findOne({email:email})

                if(clientExist) {
                    throw new Error("Error, El cliente ya esta registrado")
                }
                const newClient = new Clientes(input)
                newClient.vendedor = ctx.usuario.id
                // Guardar en base de datos
                const save = await newClient.save()

                return save
                
            } catch (error) {
                console.log(error);
            }
        },
        actualizarCliente:async(_,{id,input},ctx)=> {
 
            // Esta funcion necesita mandar el token del usuario que este autenticado
            let cliente = await Clientes.findById(id)

            if(!cliente) {
                throw new Error("Error, el cliente no existe")
            }


            if(cliente.vendedor === ctx.usuario.id.toString() ) {
                console.log("son iguales");
            }

            // guardar el cliente

            cliente = await Clientes.findOneAndUpdate({_id:id},input,{new:true})

            return cliente

        },
        borrarCliente:async(_,{id},ctx)=> {
            const cliente = await Clientes.findOne({_id:id})
            console.log("XDDDDDDDDDD");
            console.log(id);
            if(!cliente) {
                throw new Error("Error, el clinete que desea eliminar no existe")
            }

            await Clientes.findOneAndDelete({_id:id})

            return "Se elimino correctamente"
        },
        // Pedido
        nuevoPedido:async(_,{input},ctx)=> {
            // Esta funcion necesita mandar el token del usuario que este autenticado
            // Verificar si el cliente existe o no 
            const {cliente,vendedor} = input

            let clienteExist = await Clientes.findOne({_id:cliente})

            if(!clienteExist) {
                throw new Error("Error, el cliente no existe")
            }

            if(clienteExist.vendedor !== ctx.usuario.id.toString() ) {
                throw new Error("Solo puedes acceder a tus clientes")
            }

            // Revisar que el stock este disponible

            for await (const articulo of input.pedido) {
                const producto = await Productos.findOne({_id:articulo.id})

                if(producto.existencia < articulo.cantidad) {
                    throw new Error("Error, no puede ingresar una cantidad mayor a la ya existente del producto" + producto.nombre)
                } else {
                    producto.existencia = producto.existencia - articulo.cantidad

                    await producto.save()
                }
            };

            const nuevoPedido = new Pedido(input)

            nuevoPedido.vendedor = ctx.usuario.id

            const resultado = await nuevoPedido.save()

            return resultado

            // Guardarlo en la base de datos
        },
        actualiarPedido:async(_,{id,input},ctx)=> {
            try {
                // ver si el pedido exist
                const existPedido = await Pedido.find({_id:id})

                if(!existPedido) {
                    throw new Error("Error, el pedido no existe")
                }
                // ver si el cliente existe
                const existCliente = await Clientes.find({_id:existPedido.id})

                if(!existCliente) {
                    throw new Error("Error, el cliente no existe")
                }

                // si el cliente y pedido pertenece al vendedor

                
                if(existPedido.vendedor.toString !== ctx.usuario.id ) {
                    throw new Error("Solo puedes editar a tus clientes")
                }

                // revisar el stock

                for await (const articulo of input.pedido) {
                    const producto = await Productos.findOne({_id:articulo.id})
    
                    if(producto.existencia < articulo.cantidad) {
                        throw new Error("Error, no puede ingresar una cantidad mayor a la ya existente del producto" + producto.nombre)
                    } else {
                        producto.existencia = producto.existencia - articulo.cantidad
    
                        await producto.save()
                    }
                };

                // guardar el pedido
                const result = await pedido.findOneAndUpdate({_id:id},input,{new:true})
                return result
            } catch (error) {
                console.log(error);
            }
        },
        eliminarPedido:async(_,{id},ctx)=> {
            try {
                // verificar si el pedido existe
                const pedido = await pedido.findOne({_id:id})

                if(!pedido) {
                    throw new Error("Error, el pedido no existe")
                }
                
                await Pedido.findOneAndDelete({_id:id})

                return "Pedido Borrado Exitosamente!"
            } catch (error) {
                console.log(error);
            }
        },
        obtenerPedidosByEstado:async(_,{estado},ctx)=>{
            try {
                // esta funcion necesitamos pasarle el token 
                const pedidos = await Pedido.find({vendedor:ctx.usuario.id,estado:estado})
                
                return pedidos
            } catch (error) {
                console.log(error);
            }
        }
    }
}


module.exports = resolvers
