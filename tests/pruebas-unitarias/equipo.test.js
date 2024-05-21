const express = require('express');
const request = require('supertest');
const equipoRutas = require('../../rutas/equipoRutas');
const EquipoModel = require('../../models/Equipo')
const mongoose  = require('mongoose');
const app = express();
app.use(express.json());
app.use('/equipos', equipoRutas);

describe('Pruebas Unitarias para Equipos', () => {
    //se ejecuta antes de iniciar las pruebas
    beforeEach(async () => {
        await mongoose.connect('mongodb://127.0.0.1:27017/appEquipos',{
            useNewUrlParser : true,            
        });
        await EquipoModel.deleteMany({});
    });
    // al finalziar las pruebas
    afterAll(() => {
        return mongoose.connection.close();
      });

    //1er test : GET
    test('Deberia Traer todas las equipos metodo: GET: mostrarEquipos', async() =>{
        await EquipoModel.create({ Nombre: 'Laptop', Tipo: 'escrito', Observaciones: 'mantenemiento',Cantidad: 1, Fecha: '02/04/2024' });
        await EquipoModel.create({ Nombre: 'pc', Tipo: 'escritorio', Observaciones: 'limpieza',Cantidad: 2, Fecha: '03/05/2024' });
        // solicitud - request
        const res =  await request(app).get('/equipos/mostrarEquipos');
        //verificar la respuesta
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(2);
    }, 10000);

    test('Deberia agregar una nuevo equipo: POST: /registrar', async() => {
        const nuevoEquipo = {
            Nombre: 'impresora', 
            Tipo: 'canom', 
            Observaciones: 'mal',
            Cantidad: 3,
            Fecha: '02/02/2024'
        };
        const res =  await request(app)
                            .post('/equipos/registrar')
                            .send(nuevoEquipo);
        expect(res.statusCode).toEqual(201);
        expect(res.body.Nombre).toEqual(nuevoEquipo.Nombre);
    });

    test('Deberia actualizar una tarea que ya existe: PUT /modificar/:id', async()=>{
        const equipoCreada = await EquipoModel.create(
                                  { Nombre: 'pc', 
                                    Tipo: 'escritori', 
                                    Observaciones: 'limpieza',
                                    Cantidad: 2,
                                    Fecha: '03/05/2024' });
        const equipoActualizar = {
            Nombre: 'impresora (editado)',
            Tipo: 'epson(editado)',
            Observaciones: 'limpieza cabezal',
            Cantidad: 3,
            Fecha: '20/05/2024'
        };
        const res =  await request(app)
                            .put('/equipos/modificar/'+equipoCreada._id)
                            .send(equipoActualizar);
        expect(res.statusCode).toEqual(201);
        expect(res.body.Nombre).toEqual(equipoActualizar.Nombre);                   

    });
   
    test('Deberia eliminar una tarea existente : DELETE /eliminar/:id', async() =>{
        const equipoCreada = await EquipoModel.create(
            { Nombre: 'impresora', 
              Tipo: 'canom', 
              Observaciones: 'malo',
              Cantidad: 1,
              Fecha: '03/02/2023' });

        const res =  await request(app)
                                .delete('/equipos/eliminar/'+equipoCreada._id);
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({mensaje :  'Registro de Equipo Mencionado fue Eliminado Correctamente'});
    });
});