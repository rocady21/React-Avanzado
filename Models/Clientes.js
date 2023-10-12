const mongoose = require("mongoose")

const ClientesSchema = mongoose.Schema({
    nombre:{
        type: String,
        require:true,
        // Trim Elimina los espacios
        trim:true
    },
    apellido:{
        type: String,
        require:true,
        // Trim Elimina los espacios
        trim:true
    },
    empresa:{
        type: String,
        require:true,
        // Trim Elimina los espacios
        trim:true

    },
    email: {
        type: String,
        unique: true,
        trim:true,
        require:true
    },
    telefono: {
        type: String,
        require:true,
        // Trim Elimina los espacios
    },
    creado: {
        type:Date,
        default: Date.now()
    },
    vendedor: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Usuario"
    }
})


// Exporto el modelo diciendole que se llame usuario
module.exports = mongoose.model("Clientes",ClientesSchema)