//importacion de libs
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const authRutas = require('./rutas/authRutas');
const Usuario = require('./models/Usuario');
require('dotenv').config();
const app = express();
// llamar rutas
const equipoRutas = require('./rutas/equipoRutas');

// configuraciones de environment
const PORT = process.env.PORT || 2000;
const MONGO_URI = process.env.MONGO_URI;
//manejo de JSON
app.use(express.json());

//CONEXION CON MONGODB\
mongoose.connect(MONGO_URI).then(
    () => {
        console.log('Conexion exitosa');
        app.listen(PORT, () => {console.log("Servidor express corriendo en el puerto: "+PORT)})
    }
).catch( error => console.log('error de conexion', error));

///
const autenticar = async (req, res, next)=>{
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token)
            res.status(401).json({mensaje: 'No existe el token de autenticacion'});
        const decodificar = jwt.verify(token, 'clave_secreta');
        req.usuario = await  Usuario.findById(decodificar.usuarioId);
        next();
    }
    catch(error){
        res.status(400).json({ error: error.message});
    }
};

app.use('/auth', authRutas);
app.use('/equipos', autenticar, equipoRutas);

//utilizar las rutas de recetas
//app.use('/equipos', equipoRutas);
