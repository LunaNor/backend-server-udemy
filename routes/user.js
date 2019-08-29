var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var mdAutenticacion = require('../middlewares/autenticacion');

var app = express();

//impotar modelo usuario
var Usuario = require('../models/usuario');


/*======================================================================= 
    Obtener todos los usuarios 
  ======================================================================= */ 
app.get('/',(req,res,next) => {

    Usuario.find({}, 'nombre email img role')
        .exec( 
            (err,usuarios) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error cargando usuario',
                    errors: err
                });
            }
            
            res.status(200).json({
                ok: true,
                usuarios
            });

    })


});



/*======================================================================= 
    Actualizar un usuario
  ======================================================================= */ 

/* ejercicio: realizar todo el metodo put nuevamente */

app.put('/:id',  mdAutenticacion.verificaToken, (req,res) => {

    /* extraigo el id de la request */
    var id = req.params.id;
    
    /* extraigo el body de la request */
    var body = req.body

    Usuario.findById(id, (err,usuario) =>  {
        
        /* Si hay un error interno en la busqueda, error 500: internal server error */
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Hubo un error interno al intentar buscar al usuario',
                errs: err
            });
        }

        /* Si simplemente no existe el usuario, error 400: bad request*/
        if (!usuario) {

            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con id: ' + ' no existe',
                errors: {message: 'No existe un usuario con esa ID'}
            });
        }

        /* Si no hay error llegara a este punto. Cambios al usuario devuelto por findById */

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err, usuarioGuardado) => {
            
            /* Si hay un error al actualizar */
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se ha podido actualizar el usuario',
                    errs: err
                });
            }

            /* Si no hay error responde el callback con codigo 200  */

            /* Para no mostrar la contraseña */
            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                mensaje: 'El usuario se ha actualizado con éxito',
                usuarioGuardado                
            })

        });

    });

});


/* Hecha con video */

/* app.put('/:id', (req,res) => {
    var id = req.params.id;
    var body = req.body 

    Usuario.findById( id, (err, usuario) => {
    
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

      
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id '+id+' no existe',
                errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( (err,usuarioGuardado) => {
            
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }
            
           
            usuarioGuardado.password = ':)';


            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

}); */

/*======================================================================= 
    Crear un nuevo usuario
  ======================================================================= */ 

/* lo que hace este post es que recibe como argumento un callback, con 2 parametros req y res */
app.post('/', mdAutenticacion.verificaToken ,(req,res)  => {

    /* accedemos al body de la request mediante el parametro, el cual trae todos los datos 
        desde el frontend (desde postman en este caso) */
    var body = req.body;


    /* Definicion para crear un nuevo usuario en base al modelo creado anteriormente */
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        img: body.img,
        role: body.role
    });


    /* luego podemos ocupar la funcion save de mongoose para enviar el usuario a la bdd
        el cual tiene como paraetros el err y los datos del usuario guardado */
    usuario.save( ( err, usuarioGuardado ) => {
        
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuarioGuardado: usuarioGuardado, //esto solo se puede hacer con body-parser
            /* sirve para saber que usuario hizo la peticion */
            usuarioToken: req.usuario
        });

    }); 

   


});

/*======================================================================= 
    Eliminar un nuevo usuario por el id
  ======================================================================= */ 

app.delete('/:id', mdAutenticacion.verificaToken, (req,res) => {

    /* Extreamos el id de la request */
    var id = req.params.id;

    /* Buscamos y eliminamos el registro  */

    Usuario.findByIdAndRemove( id, (err, usuarioEliminado) =>  {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se ha podido eliminar el usuario',
                errs: err
            });
        }

        if (!usuarioEliminado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un usuario con esa id',
                errs: {message: 'No existe un usuario con esa id'}
            });
        }

        res.status(200).json({
            ok: true,
            mensaje: 'El usuario ha sido borrado con éxito',
            usuarioEliminado
        })

    });

})

module.exports = app;