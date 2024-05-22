const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const usuarioSchema = new mongoose.Schema({
    // nombre: { type: String, require: true}
    nombreusuario: {
        type: String, 
        required : true,
        unique : true
    },
    correo : {
        type: String, 
        required : true,
        unique : true
    },
    contraseña : {
        type: String, 
        required : true
    }
});

// hashear contraseña
usuarioSchema.pre('save', async function (next){
    if (this.isModified('contraseña')){
        this.contraseña =  await bcrypt.hash(this.contraseña, 10);
        
    }
    next();
});
//comparar contraseña
usuarioSchema.methods.compararContraseña = async function  ( contraseñaComparar ){
    return await bcrypt.compare(contraseñaComparar, this.contraseña);
};

const UsuarioModel = mongoose.model('usuario',usuarioSchema, 'Usuario');
module.exports = UsuarioModel;