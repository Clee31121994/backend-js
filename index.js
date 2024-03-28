'use strict'

let mongoose = require('mongoose');
let app = require('./app');
let port = 3700;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/portafolio')
        .then(() => {
            console.log("Conexión a base de datos establecida...");

            // Creacion del servidor
            app.listen(port, () => {
                console.log("Servidor corriendo corrrectamente en la url localhost:3700");
            });

        })
        .catch(err => console.log(err));