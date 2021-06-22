'use strict'

var Encuesta = require('../modelos/encuestas.mode');

function agregarEncuestas(req, res) {
    var encuestaModel = new Encuesta();
    var params = req.body;

    if(params.tituloEncuesta && params.descripcionEncuesta){
        encuestaModel.tituloEncuesta = params.tituloEncuesta;
        encuestaModel.descripcionEncuesta = params.descripcionEncuesta;
        encuestaModel.usuarioEncuesta = req.user.sub;
        encuestaModel.opinion ={
            si: 0,
            no: 0,
            ninguna: 0,
            usuariosEncuestados: []
        }

        encuestaModel.save((err, encuestaGuardada) =>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion de la encuesta'});
            if(!encuestaGuardada) return res.status(500).send({ mensaje: 'Error al agregar la encuesta'});

            return res.status(200).send({ encuestaGuardada })
        })
    }else{
        return res.status(500).send({ mensaje: "Rellene todos los datos necesarios"})
    }
}

function comentarEncuesta(req, res) {
    var encuestaId = req.params.idEncuesta;
    var params = req.body;

    Encuesta.findByIdAndUpdate(encuestaId, 
        { $push: { listaComentarios: { textoComentario: params.textoComentario, comentarioUsuarioId: req.user.sub } } },
        {new: true}, (err, comentarioGuardado)=>{
            if(err) return res.status(500).send({ mensaje: 'Error en la peticion del Comentario en Encuestas' });
            if(!comentarioGuardado) return res.status(500).send({mensaje: 'Error al guardar el comentario'});

            return res.status(200).send({ comentarioGuardado })
        })
}

function editarComentario(req, res) {
    var encuestaId = req.params.idEncuesta;
    var comentarioId = req.params.idComentario;
    var params = req.body;
    var datosPorActualizar = {};

    if(params.textoComentario !== null) datosPorActualizar['listaComentarios.$.textoComentario'] = params.textoComentario;
    
    Encuesta.findOneAndUpdate({ _id: encuestaId, "listaComentarios._id": comentarioId}, datosPorActualizar, {new:true}, 
    (err , encuestaActualizada)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion del comentario'});
        if(!encuestaActualizada) return res.status(500).send({ mensaje: 'Error al editar del Comentario'})

    })
    
}

module.exports = {
    agregarEncuestas,
    comentarEncuesta
}