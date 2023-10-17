const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema({
    nombre:{
        type: String,
        require:true,
        // Trim Elimina los espacios
        trim:true
    },
    existencia:{
        type: Number,
        require:true,
    },
    precio:{
        type: Number,
        require:true,
        trim:true

    },
    creado: {
        type:Date,
        default: Date.now()
    }
})


// necesitamos crear un indice para poder buscar

ProductSchema.index({nombre: "text"})


// Exporto el modelo diciendole que se llame usuario
module.exports = mongoose.model("Productos",ProductSchema)