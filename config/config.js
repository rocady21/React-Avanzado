const mongoose = require("mongoose")
require("dotenv").config({path: "variables.env"})

const conectarDB = async ()=> {
    try {
        await mongoose.connect(process.env.DB_MONGOOSE,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
            useFindAndModify:false,
            useCreateIndex:true
        })
        console.log("DB CONECTADA");
    } catch (error) {
        console.log("hubo un error");
        console.log(error);
        process.exit(1) // Detener la aplicacion
    }
}

module.exports = conectarDB