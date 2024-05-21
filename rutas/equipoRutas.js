const express = require('express');
const rutas = express.Router();
const EquipoModel = require('../models/Equipo');
const UsuarioModel = require('../models/Usuario');

//endpoint 1.  traer todas las equipos
rutas.get('/mostrarEquipos', async (req, res) => {
    try  {
        const equipos = await  EquipoModel.find();
        res.json(equipos);
    } catch (error){
        res.status(500).json({mensaje: error.message});
    }
});
//endpoint 2. REGISTRAR EQUIPOS REALIZADOS
rutas.post('/registrar', async (req, res) => {
    const equipos = new EquipoModel({
        Nombre: req.body.Nombre,
        Tipo: req.body.Tipo,
        Observaciones: req.body.Observaciones,
        Cantidad: req.body.Cantidad,
        Fecha: req.body.Fecha
    })
    try {
        const nuevoEquipo = await equipos.save();
        res.status(201).json(nuevoEquipo);
    } catch (error) {
        res.status(400).json({ mensaje :  error.message})
    }
});
//endpoint 3 MODIFICAR REGISTRO EQUIPO
rutas.put('/modificar/:id', async (req, res) => {
    try {
        const equipoModificado = await EquipoModel.findByIdAndUpdate(req.params.id, req.body, { new : true});
        if (!equipoModificado)
            return res.status(404).json({mensaje : 'Equipo que Busca no Existe VERIFIQUE POR FAVOR!!!'});
        else
        return res.status(201).json(equipoModificado);

    } catch (error) {
        res.status(400).json({mensaje : error.mensage})

    }
})
//ENDPOINT 4. ELIMINAR EQUIPO ENTREGADO O REMOVIDO 
rutas.delete('/eliminar/:id',async (req, res) => {
    try {
       const equipoEliminado = await EquipoModel.findByIdAndDelete(req.params.id);
       if (!equipoEliminado)
            return res.status(404).json({ mensaje : 'Equipo que Busca no Existe VERIFIQUE POR FAVOR!!!'});
       else 
            return res.json({mensaje :  'Registro de Equipo Mencionado fue Eliminado Correctamente'});    
       } 
    catch (error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//endpoint 5 BUSCAR EQUIPO POR CODIGO DE REGISTRO
rutas.get('/codigo/:id', async (req, res) => {
    try {
        const equipos = await EquipoModel.findById(req.params.id);
        if (!equipos)
            return res.status(404).json({ mensaje : 'Equipo no Existe Verifique el Codigo de Registro!!!'});
        else 
            return res.json(equipos);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// endpoint 6 BUSCAR EQUIPO POR TIPO DE REGISTRO
rutas.get('/tipoDeEquipo/:tipo', async (req, res) => {
    try {
        const equipoTipo = await EquipoModel.find({ Tipo: new RegExp(req.params.tipo, 'i')});
        return res.json(equipoTipo);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});

//endpoint 7 BORRAR TODOS LOS REGISTROS DE EQUIPOS
rutas.delete('/eliminarTodos', async (req, res) => {
    try {
        await EquipoModel.deleteMany({});
        return res.json({mensaje: "Todos los Equipos han sido eliminadas Existosamente"});
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
// endpoint 8 MOSTRAR TOTAL EQUIPOS REGISTRADOS
rutas.get('/registroTotal', async (req, res) => {
    try {
        const registro = await EquipoModel.countDocuments();
        return res.json({RegistroHastaLaFecha: registro });
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//endpoint 9 OBTENER EQUIPOS ORDENADAS POR FECHA DE INGRESO
rutas.get('/ordenarEquipos', async (req, res) => {
    try {
       const equiposOrdenado = await EquipoModel.find().sort({ Fecha: 1});
       res.status(200).json(equiposOrdenado);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
//endpoint 10 OBTENER EQUIPOS POR CANTIDAS REGISTRADAS
rutas.get('/equiposPorCantidad/:cantidad', async (req, res) => {
    try {
       const equipos = await EquipoModel.find({ Cantidad : req.params.cantidad});
       res.status(200).json(equipos);
    } catch(error) {
        res.status(500).json({ mensaje :  error.message})
    }
});
///......USUARIO
//REPORTES 1
rutas.get('/equipoPorUsuario/:usuarioId', async (peticion, respuesta) =>{
    const {usuarioId} = peticion.params;
    console.log(usuarioId);
    try{
        const usuario = await UsuarioModel.findById(usuarioId);
        if (!usuario)
            return respuesta.status(404).json({mensaje: 'usuario no encontrado'});
        const equipos = await EquipoModel.find({ usuario: usuarioId}).populate('usuario');
        respuesta.json(equipos);

    } catch(error){
        respuesta.status(500).json({ mensaje :  error.message})
    }
})

//REPORTES 2
//sumar cantidad de recetas por Usuarios
rutas.get('/cantidadPorUsuario', async (req, res) => {
    try {   
        const usuarios = await UsuarioModel.find();
        const reporte = await Promise.all(
            usuarios.map( async ( usuario1 ) => {
                const equipos = await EquipoModel.find({ usuario: usuario1._id});
                const totalCantidad = equipos.reduce((sum, equipos) => sum + equipos.Cantidad, 0);
                return {
                    usuario: {
                        _id: usuario1._id,
                        nombreusuario: usuario1.nombreusuario
                    },
                    totalCantidad,
                    equipos: equipos.map( r => ( {
                        _id: r._id,
                        nombre: r.Nombre,
                        cantidad: r.Cantidad
                    }))
                }
            } )
        )
        res.json(reporte);
    } catch (error){
        res.status(500).json({ mensaje :  error.message})
    }
})
module.exports = rutas;