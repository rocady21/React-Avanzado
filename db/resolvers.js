const Usuario = require("../Models/Usuario")
const Clientes = require("../Models/Clientes")
const bcryptjs = require("bcryptjs")
// para importar las variables de entorno
require("dotenv").config({path: "variables.env"})
const jwt = require("jsonwebtoken")
const Productos = require("../Models/Productos")
// los resolvers generalemnte retornan funciones


// funcion para crear token

const createToken = (usuario,secret,expiresIn) => {

    // al payload seria la info que necesita la cabezera para firmarlo}
    const {id,nombre,email,apellido} = usuario
    const paylaod = {
        id,
        email
    }

    // para firmar un nuevo token
    return jwt.sign(paylaod,secret,{expiresIn})
}

//Resolvers
const resolvers = {
    Query:{
        obtenerInfoByToken:async(_,{token},ctx)=>  {
            const userToken = await jwt.verify(token,process.env.PALABRA_SECRET)
            const {id} = userToken
            if(id) {
                const userbyToken = await Usuario.findOne({_id:id})
                return userbyToken
            }
            throw new Error("Error, el token no es valido")
        },
        obtenerProductos:async()=> {
            console.log("xd");
            try {
                const productos = await Productos.find() 

                return productos
            } catch (error) {
                console.log(error);
            }
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
        obtenerProductoById:async(_,{id},ctx)=> {
            console.log(id);
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
                const {email} = input
                const clientExist = await Clientes.findOne({email:email})

                if(clientExist) {
                    throw new Error("Error, El cliente ya esta registrado")
                }
                const newClient = new Clientes(input)
                
                // Guardar en base de datos
                const save = await newClient.save()

                return save
                
            } catch (error) {
                console.log(error);
            }
        },
        actualizarCliente:async()=> {

        },
        borrarCliente:async()=> {
            
        }
        
    }
}


module.exports = resolvers
