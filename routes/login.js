var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

var app = express();
var Usuario = require('../models/usuario');

app.post('/', (req, res) => {

    var body = req.body;


    Usuario.findOne( {email:body.email}, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuarios',
                errs: err
            });
        } 
        
        if ( !usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales no incorrectas - email',
                errors: err
            })
        }

        /* comparancion de password */
        /* si es falso, hasta aqui llega, sino sigue adelante */
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas - password',
                errors: err
            })
        }

        /* No se envia la contraseña */
        usuarioDB.password = ':)';
        
        /* Creación de token */
        var token = jwt.sign({usuario: usuarioDB}, SEED, {expiresIn: 14400}); // 4 horas

        res.status(200).json({
            ok: true,
            usuarioDB,
            token: token,
            id: usuarioDB._id
        });

    });



});

module.exports = app;
