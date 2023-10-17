const mongoose = require("mongoose")

const PedidosSchema = mongoose.Schema({
    pedido:{
        type: Array,
        require
    },
    total:{
        type: Number,
        require:true,
    },
    cliente:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Clientes",
        require:true

    },
    vendedor:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Usuario",
        require:true

    },
    estado: {
        type:String,
        default: "PENDIENTE"
    },
    creado: {
        type: Date,
        default: Date.now()
    }
})



// Exporto el modelo diciendole que se llame usuario
module.exports = mongoose.model("Pedido",PedidosSchema)