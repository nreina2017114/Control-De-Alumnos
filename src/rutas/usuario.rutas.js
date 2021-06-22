'use strict'

//IMPORTACIONES

var express = require("express");
var usuarioControlador = require("../controladores/usuario.controlador");

// IMPORTACION MIDDLEWARES PARA RUTAS
var md_autorizacion = require("../middlewares/aunthenticated");

//RUTAS
var api = express.Router();
api.get('/ejemplo', md_autorizacion.ensureAuth, usuarioControlador.ejemplo);
api.post('/registrar', usuarioControlador.registrar);
api.get('/obtenerUsuarios', usuarioControlador.obtenerUsuarios);
api.get('/obtenerUsuarioId/:idUsuario', usuarioControlador.obtenerUsuarioID);
api.post('/login', usuarioControlador.login);
api.put('/editarUsuario/:id', md_autorizacion.ensureAuth, usuarioControlador.editarUsuario);

module.exports = api; 