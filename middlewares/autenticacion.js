var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;

/*======================================================================= 
    Verificar token 
  ======================================================================= */ 

exports.verificaToken = function(req,res,next) {
    var token = req.query.token;

    jwt.verify(token, SEED, (err,decoded) => {
        
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err 
            });
        }

        /* le asigno a la request el ususario decodificado del token */
        /* sirve para saber que usuario hizo la peticion */
        req.usuario = decoded.usuario;

        next();
    

    });
}

