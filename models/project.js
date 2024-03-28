'use strict'

let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ProjectSchema = Schema({
    name: String,
    description: String,
    category: String,
    year: Number,
    langs: String,
    image: String
});

module.exports = mongoose.model('Project', ProjectSchema);
// Porjects --> guarda los documentos en la coleccion