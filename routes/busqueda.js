
var express = require('express');
var app = express();

var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

/* ============================================================================================================================ */
// ================================================= BÚSQUEDAS ESPECIFICAS ======================================================
/* ============================================================================================================================ */

app.get('/coleccion/:tabla/:busqueda', (req,res,next) => {

    var tabla = req.params.tabla;
    var busqueda =req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');

    var promesa;


    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda,regex);
            break;
        case 'medicos':
            promesa = buscarMedicos(busqueda,regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda,regex);
            break;

        default:  
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos de búsqueda solo son: usuarios, médicos y hospitales',
                error: {message: 'Tipo de tabla/coleccion no válido'}
            });
    }

    promesa.then( data => {

        res.status(200).json({
            ok: true,
            [tabla] : data
        }); 

    })



});


/* ============================================================================================================================ */
// ================================================= BÚSQUEDA GENERAL ======================================================
/* ============================================================================================================================ */

app.get('/todo/:busqueda', (req,res,next) => {


    var busqueda = req.params.busqueda;
    var regex = new RegExp (busqueda, 'i');



    Promise.all([
            buscarHospitales(busqueda, regex),
            buscarMedicos(busqueda,regex),
            buscarUsuarios(busqueda,regex)
        ])
        /* arreglo de respuestas */
        .then(respuestas => {

            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2]
            });

        });

   
   
    
});


function buscarHospitales ( busqueda, regex) {

    return new Promise ((resolve, reject) => {

        Hospital.find ( {nombre: regex})
            .populate('usuario','nombre email')
            .exec( (err, hospitalBusqueda) =>  {
            
            if (err) {
                reject('Error al cargar hospitales',err)
            } else {
                resolve(hospitalBusqueda)
            }

        });

    });

}


function buscarMedicos ( busqueda, regex) {
    
    return new Promise ((resolve, reject) => {
        
        Medico.find ( {nombre: regex})
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec(
            (err, medicoBusqueda) =>  {
            
            if (err) {
                reject('Error al cargar medicos',err)
            } else {
                resolve(medicoBusqueda)
            }
            
        });
        
    });
    
}


function buscarUsuarios ( busqueda, regex) {

    return new Promise ((resolve, reject) => {

        Usuario.find({},'nombre email role')
        .or({'nombre': regex}, {'email': regex})
        .exec((err,usuario) => {

            if (err) {
                reject('Error al cargar usuarios', err);
            } else {
                resolve(usuario);
            }

        })

    });

}
/* exporto la ruta fuera de este archivo */
module.exports = app;