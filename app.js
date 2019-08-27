// Requires
var express = require('express');
var mongoose = require('mongoose'); 

// Inicializar variables

var app = express();


// Conexion a la base datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res) => {
    if (err) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');

});

// Rutas

app.get( '/', (req,res,next) => {

    /* lo que hacemos es decir: cuando el response tiene codigo de status 200 (que todo salio bien) 
    envio un json con un objeto javascript, en donde iran dos variables*/
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

});


// Escuchar peticiones 
app.listen(3000, () => {
    console.log('Express server puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});