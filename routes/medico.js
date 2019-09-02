var express = require('express');

var app = express();

var Medico = require('../models/medico');

var mdAutentiacion = require('../middlewares/autenticacion');


/* ============================================================================================================= */
// Obtener todos los medicos (Get)
/* ============================================================================================================= */

app.get('/', (req,res) => {

    var desde = req.query.desde || 0; 
    desde = Number(desde);

    Medico.find({})
    .skip(desde)
    .limit(5)
    .populate('usuario', 'nombre email')
    .populate('hospital')
    .exec(
        (err,medicos) => {

            if (err) {

                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al cargar los medicos',
                    errors: err
                });

            }

            Medico.count( {}, (err,conteo) => {
                res.status(200).json({
                    ok: true,
                    medicos,
                    total: conteo
                });

            });


        }
    )

});

/* ============================================================================================================= */
// Actualizar un medico (Put)
/* ============================================================================================================= */

app.put('/:id', mdAutentiacion.verificaToken, (req, res) => {

    var id = req.params.id;

    var body = req.body;

    Medico.findById(id, (err, medico) => {

        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar un medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con id: '+id+' no existe',
                errors: {message: 'No existe un usuario con ese ID'}
            })
        }

        medico.nombre = body.nombre;
        /* solo pide el id del usuario  */
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save( (err, medicosGuardado) => {
            
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medicosGuardado
            });

            

        });

    });

});

/* ============================================================================================================= */
// Crear un nuevo medico
/* ============================================================================================================= */

app.post('/', mdAutentiacion.verificaToken, (req, res) => {

    var body = req.body;

    var nuevoMedico = new Medico ({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

  

    nuevoMedico.save((err, medicosGuardado) => {
    
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear Medico',
                errs: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicosGuardado
        });

    });

});

/* ============================================================================================================= */
// Borrar un medico por id 
/* ============================================================================================================= */

app.delete('/:id', mdAutentiacion.verificaToken, (req,res) => {

    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medicosBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicosBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un medico con ese id'
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicosBorrado
        });

    });

});


module.exports = app;