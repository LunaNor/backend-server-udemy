var express = require('express');

var app = express();

var mdAutentiacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');

/* ============================================================================================================= */
// Obtener todos los hospitales (Get)
/* ============================================================================================================= */

app.get('/', (req,res) => {

    var desde = req.query.desde || 0; 
    desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario','nombre email')
    .exec(
        (err,hospitales) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los hospitales',
                    errors: err
                });

            }

            Hospital.count({}, (err,conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales,
                    total: conteo
                });

            });


        }
    )

});

/* ============================================================================================================= */
// Actualizar un hospital (Put)
/* ============================================================================================================= */

app.put('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con id: '+id+' no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }

        hospital.nombre = body.nombre;
        /* solo pide el id del usuario  */
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospitalGuardado
            });

            

        });

    });

});

/* ============================================================================================================= */
// Crear un nuevo hospital
/* ============================================================================================================= */

app.post('/', mdAutentiacion.verificaToken, (req, res) => {

    var body = req.body;

    var nuevoHospital = new Hospital ({
        nombre: body.nombre,
        /* el usuario se encuentra en la request */
        usuario: req.usuario._id
    });

    nuevoHospital.save((err, hospitalGuardado) => {
    
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Hospital'
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});

/* ============================================================================================================= */
// Borrar un hospital por id 
/* ============================================================================================================= */

app.delete('/:id', mdAutentiacion.verificaToken, (req,res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id'
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;