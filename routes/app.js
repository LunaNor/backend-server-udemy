
var express = require('express');
var app = express();


app.get('/', (req,res,next) => {

    /* lo que hacemos es decir: enviamos un res con código de status 200 (que todo salio bien) 
    y envio un json con un objeto javascript, en donde iran dos variables*/
    res.status(200).json({
        ok: true,
        mensaje: 'Petición realizada correctamente'
    })

});


/* exporto la ruta fuera de este archivo */
module.exports = app;