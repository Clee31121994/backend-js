'use strict'

const project = require('../models/project');
let Project = require('../models/project');
let path = require('path');
const mongoose = require('mongoose'); // Importar mongoose

let fs = require('fs');

let controller = {

    home: function(req, res){
        return res.status(200).send({
            message: 'Soy el home'
        })
    },

    test: function(req ,res){
        return res.status(200).send({
            message: "Soy el metodo o accion test del controlador de project"
        });
    },

    saveProject: function(req, res){
        let project = new Project();

        let params = req.body;
        project.name = params.name;        
        project.description = params.description;
        project.category = params.category;
        project.year = params.year;
        project.langs = params.langs;
        project.image = null;

        project.save().then((projectStored) => {
        
            if (!projectStored){
                return res.status(404).send({message: 'No se ha podido guardar el proyecto'});
            }
            return res.status(200).send({project: projectStored});
        }).catch((err) => {
            return res.status(500).send({message: 'Error al guardar el documento.', error: err});
        });
    },

    getProject: function(req, res){
        let projectId = req.params.id;

        // Validar si el projectId es un ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(projectId)) {
            return res.status(400).json({
                status: "error",
                message: "El ID del proyecto no es válido"
            });
        }

        // Convertir el projectId a un ObjectId válido
        const objectId = new mongoose.Types.ObjectId(projectId);

        Project.findById(objectId).then((project) => {
            if (!project) {
                return res.status(404).json({
                    status: "error",
                    message: "El proyecto no existe"
                });
            }

            return res.status(200).json({
                status: "success",
                project
            });
        }).catch((error) => {
            if (error.name === 'CastError') {
                return res.status(400).json({
                    status: "error",
                    message: "El ID del proyecto no es válido"
                });
            } else {
                return res.status(500).json({
                    status: "error",
                    message: "Ha ocurrido un error",
                    error
                });
            }
        });
    },

    getProjects: function(req, res){
        project.find({}).sort("+year").then((projects)=>{
            
 
            if(!projects) return res.status(404).send({message: "No hay projectos que mostrar..."});
 
            return res.status(200).send({message: "Proyectos ",
                                         projects});
        }).catch((err)=>{
            if(err) return res.status(500).send({message: "Error al devolver los datos"});
        })
    },

    updateProject: function (req, res){

        let projectId = req.params.id;
        let update = req.body;
      
        Project.findByIdAndUpdate(projectId, {
          name: update.name,
          description: update.description,
          category: update.category,
          year: update.year,
          langs: update.langs,
          image: update.image
        }, { new: true })
          .then((projectUpdated) => {
            return res.status(200).send({
              project: projectUpdated
            })
          })
          .catch(() => {
            return res.status(404).send({ message: "Proyecto no encontrado para actualizar." });
          })
    },

    deleteProject: function (req, res){
        let projectId = req.params.id;

        Project.findByIdAndDelete(projectId)
        .then((projectRemoved)=>{
            return res.status(200).send({
                project: projectRemoved
            })
        })
        .catch((err, projectRemoved)=>{
            if(err) return res.status(500).send({message: 'No se pudo eliminar el proyecto.'});

            if(projectRemoved) return res.status(404).send({message: 'No se pudo encontrar el proyecto para su eliminación.'});
        })
    },

    uploadImage: async function (req, res) {
        try {
            let projectId = req.params.id;
            let fileName = 'Imagen no subida';
 
            if (req.files && req.files.image) {
                let filePath = req.files.image.path;
                let fileSplit = filePath.split('\\');
                let fileNameNew = fileSplit[1];
                let extSplit = fileNameNew.split('\.');
                let fileExt = extSplit[1];
                
                //var fileExt = extSplit[1];
                //fileExt = fileExt.toLowerCase();
                
 
                if (fileExt == 'png' || fileExt == 'jpg' || fileExt == 'jpeg' || fileExt == 'gif') {
 
                    var updateImage = await Project.findByIdAndUpdate(
                        projectId,
                        { image: fileNameNew },
                        { new: true }
                    );
 
                    if (updateImage) {
                        return res.status(200).send({
                            files: fileNameNew,
                            message: 'El archivo se ha subido con éxito'
                        });
                    } else {
                        return res.status(404).send({
                            message: 'No se ha encontrado el proyecto'
                        });
                    }
                } else {
                    fs.unlink(filePath, (err) => {
                        return res.status(200).send({ message: "La extension no es valida" })
                    })
                }
 
            } else {
                return res.status(200).send({
                    message: fileName
                });
            }
        } catch (err) {
            return res.status(500).send({ message: 'Error al llamar al método uploadImage' });
        }
    },

    getImageFile: function(req, res){
        let file = req.params.image;
        let path_file = './uploads/'+file;

        fs.access(path_file, fs.constants.F_OK, (err) => {
            if(err){
                return res.status(200).send({message: "No existe la im imagen..."})
            } else{
                return res.sendFile(path.resolve(path_file));
            }
        });
    }

};

module.exports = controller;