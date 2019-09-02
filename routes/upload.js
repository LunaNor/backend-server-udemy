var express = require('express');

var fileUpload = require('express-fileupload');
var fs = require('fs');


var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

//middleware
app.use(fileUpload());


app.put('/:tipo/:id', (req,res,next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    //tipos de coleccion 
    var tiposValidos = ['hospitales','medicos','usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de colección no es válida',
            errors: {message: 'Tipo de colección no es válida'}
        });
    }

    if (!req.files) {
  
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {message: 'Debe de seleccionar un imagen'}
        });

    }

    //Obtener el nombre del archivo
    var archivo = req.files.imagen; /* SACAMOS EL ARCHIVO QUE VIENE EN LA REQUEST */
    var nombreCortado = archivo.name.split('.'); //arreglo conformado por todas las palabras del archivo separadas por punto
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //solo estas extensiones aceptamos

    var extensionesValidas = ['png','jpg','gif','jpeg'];     

    if (extensionesValidas.indexOf(extensionArchivo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Extensión no válida',
            errors: {message: 'Las extensiones válidas son: ' + extensionesValidas.join(', ')}
        });
    }

    //Nombre de archivo personalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds()}.${ extensionArchivo }`;

    //mover el archivo 
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        subirPorTipo (tipo, id, nombreArchivo, res); //el res saldra de aca 

       
    });


});


function subirPorTipo (tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    errors: {message: 'Usuario no existe'}
                });
            }


            var pathViejo = './uploads/usuarios/' + usuario.img;
            // si existe, elimina la imagen anterior
            if ( fs.existsSync(pathViejo) ) {
                fs.unlinkSync( pathViejo);
            }

            //le asignamos el nombre de la nueva imagen
            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) =>  {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada exitosamente',
                    usuarioActualizado
                });
                
            });

        });

    }
    
    if (tipo === 'medicos') {
        Medico.findById(id, (err, medico) => {

            if (!medico) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Médico no existe',
                    errors: {message: 'Médico no existe'}
                });
            }


            var pathViejo = './uploads/medicos/' + medico.img;
            // si existe, elimina la imagen anterior
            if ( fs.existsSync(pathViejo) ) {
                fs.unlinkSync( pathViejo);
            }

            //le asignamos el nombre de la nueva imagen
            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado) =>  {

                medicoActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada exitosamente',
                    medicoActualizado
                });
                
            });

        });
    }

    if (tipo === 'hospitales') {

        
        Hospital.findById(id, (err, hospital) => {

            if (!hospital) {
                return res.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    errors: {message: 'Hospital no existe'}
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;
            // si existe, elimina la imagen anterior
            if ( fs.existsSync(pathViejo) ) {
                fs.unlinkSync( pathViejo);
            }

            //le asignamos el nombre de la nueva imagen
            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado) =>  {

                hospitalActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada exitosamente',
                    hospitalActualizado
                });
                
            });

        });
    }

}

module.exports = app;