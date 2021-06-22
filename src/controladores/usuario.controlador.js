'use strict'

// IMPORTACIONES
var Usuario = require("../modelos/usuario.model");
var bcrypt = require('bcrypt-nodejs');
var jwt = require("../servicios/jwt");

function ejemplo(req, res) {
    if(req.user.rol === "ROL_USUARIO"){
        res.status(200).send({mensaje: `Hola  mi nombre es: ${req.user.nombre}`})
    } else{
        res.status(400).send({ mensaje: 'Solo el Rol de tipo usuario puede acceder'})
    }
}

function registrar(req, res){
    var usuarioModel = Usuario();
    var params = req.body;

    if (params.email && params.username && params.password) {
        // Modelo Base de Datos = los datos del cuerpo de datos/formulario
        usuarioModel.nombre = params.nombre;
        usuarioModel.username = params.username;
        usuarioModel.email = params.email;
        usuarioModel.rol = 'ROL_USUARIO';
        usuarioModel.imagen = null;

        Usuario.find({
            $or: [
                {username: usuarioModel.username},
                {email: usuarioModel.email}
            ]
         }).exec((err, usuariosEncontrados)=>{
             if(err) return res.status(500).send({mensaje: 'Error en la peticion de Usuarios'});    

             if (usuariosEncontrados && usuariosEncontrados.length >=1) {
                 return res.status(500).send({mensaje: 'El usuario ya existe'});
                 
             }else{
                 bcrypt.hash(params.password, null, null, (err, passwordEncriptada)=>{
                     usuarioModel.password = passwordEncriptada;

                     usuarioModel.save((err, usuarioGuardado) => {
                         if(err) return res.status(500).send({ mensaje: 'Error en la peticion de Guardar Usuario'});

                         if (usuarioGuardado) {
                             res.status(200).send({ usuarioGuardado })
                             
                         }else{
                             res.status(404).send({ mensaje: 'No se ha podido registrar el usuario' })
                         }
                     })
                 })
             }

         })
        
    }
}

function obtenerUsuarios(req, res){
    Usuario.find().exec((err, usuarios) =>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de obtener Usuarios' });
        if(!usuarios) return res.status(500).send({ mensaje: 'Error en la consulta de Usuarios o no tiene datos'});
        return res.status(200).send({ usuarios});
    })
}

function obtenerUsuarioID(req, res){
    var usuarioId = req.params.idUsuario;

    Usuario.findById(usuarioId, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion de  Usuario'});
        if(!usuarioEncontrado) return res.status(500).send({ mensaje: 'Error al obtener el usuario'});
        return res.status(200).send({ usuarioEncontrado});
    })
}

function login(req, res){
    var params = req.body;
    /*
    Usuario.find() <----- Me devuelve un array de objetos []
    Usuario.findOne() <----- Me devuelve un objeto {}
    */

    Usuario.findOne({ email: params.email},(err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error  en la peticion'});

        if (usuarioEncontrado) {
            bcrypt.compare(params.password, usuarioEncontrado.password, (err, passVerificada)=>{
                if(passVerificada){
                    if(params.getToken === 'true'){
                        return res.status(200).send({ 
                            token: jwt.createToken(usuarioEncontrado)
                        })
                    } else{
                        usuarioEncontrado.password = undefined;
                        return res.status(200).send({ usuarioEncontrado});
                    }
                } else{
                   return res.status(500).send({ mensaje: 'El usuario no se a podido identificar'});
                }
            })
        } else{
            return status(500).send({ mensaje: 'Error al buscar el usuario'});
        }
    })
}

function editarUsuario(req, res){
    var idUsuario = req.params.id;
    var params = req.body;

    //BORRAR LA PROPIEDAD DE PASSWORD EN EL BODY
    delete params.password;

    if(idUsuario != req.user.sub){
        return res.status(500).send({ mensaje: 'No posee los permisos para editar ese usuario'});
    }
    Usuario.findByIdAndUpdate(idUsuario, params, { new: true},(err, usuarioActualizado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion'});
        if(!usuarioActualizado) return res.status(500).send({ mensaje: 'No se a podido editar el Usuario'});

        return res.status(200).send({ usuarioActualizado })
    })
 }

 /*

 if(params.email !=null || params.username !=null){
     Usuario.find({ $or: [
         {email: params.email}  
        
        ] }, (err, usuarioEncontrado)=>{
            
        })
 }
 */


module.exports = {    
    ejemplo,
    registrar,
    obtenerUsuarios,
    obtenerUsuarioID,
    login,
    editarUsuario
}