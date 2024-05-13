const mongoose = require('mongoose');
//definir el esquema
const equipoSchema = new mongoose.Schema({
    //nombre: { type: String, require: true}
    Nombre: String,
    Tipo: String,
    Observaciones: String,
    Cantidad: Number,
    Fecha: String
});

const EquipoModel = mongoose.model('Equipo',equipoSchema, 'equipos');
module.exports = EquipoModel;