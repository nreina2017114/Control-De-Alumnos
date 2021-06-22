'use strict'

// VARIABLES GLOBALES
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// IMPORTACION DE RUTAS
var usuario_rutas = require("./src/rutas/usuario.rutas");
var encuestas_rutas = require("./src/rutas/encuestas.rutas");

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());


// APLICACION DE RUTAS localhost:3000/api/ejemplo
app.use('/api', usuario_rutas, encuestas_rutas);

// EXPORTAR
module.exports = app;