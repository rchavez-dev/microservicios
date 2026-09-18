const mongose = require('mongoose');

const trabajadorSchema = new mongose.Schema({
    nombre:{
        type: String,
        required: true
    },
    apellido:{
        type: String,
        required: true
    },
    cedula:{
        type: String,
        required: true,
        unique: true
    },
    cargo:{
        type: String,
        required: true
    },
    departamento:{
        type: String,
        required: true
    },
    fechaIngreso:{
        type:Date,
        required:true
    }
});

module.exports = mongose.model('Trabajador', trabajadorSchema);