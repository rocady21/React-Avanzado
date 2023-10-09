const mongoose = require("mongoose")

const UsuarioSchema = mongoose.Schema({
    nombre:{
        type: String,
        require:true,
        // Trim Elimina los espacios
        trim:true
    },
    apellido:{
        type: String,
        require:true,
        trim:true

    },
    email:{
        type: String,
        require:true,
        trim:true,
        unique:true


    },
    password:{
        type: String,
        require:true,
        trim:true,
    },
    creado: {
        type:Date,
        default: Date.now()
    }
})



// Exporto el modelo diciendole que se llame usuario
module.exports = mongoose.model("Usuario",UsuarioSchema)