const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose")
const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGODB_URI;

try {
    mongoose.connect(mongoUri);
    console.log("Conectado a MongoDB");
} catch(error){
    console.debug("Error en BD", error);
}

const perfumeSchema = new mongoose.Schema({
    nombre: String,
    marca: String
});

const Perfume  = mongoose.model('Perfume', perfumeSchema);



app.get('/', (req, res)=> {
    res.send("Bienvenido a Api Perfumes")
})
app.get('/perfumes', async (req, res)=> {
    try {
        const perfumesDB = await Perfume.find();
        res.status(200).json({data: perfumesDB})
    } catch(e){
        console.error("No se pudieron obtener los perfumes");
        res.status(500).json({message: "Error al obtener perfumes"})
    }
   
})

app.get('/perfumes/:id', async(req, res)=> {
    const id = req.params.id;
    try {
        const perfume = await Perfume.findById(id);
        res.status(200).json({data: perfume})
    } catch(e){
        console.error("No se pudo obtener el perfume");
        res.status(500).json({message: "Error al obtener  el perfume"})
    }  
})

app.post('/perfumes', async (req, res)=> {
    const perfume = new Perfume({ 
        titulo: req.body.nombre,
        autor: req.body.marca
    })

    try {
        await perfume.save(); 
        res.status(201).json({
            data: perfume,
            message: "perfume creado exitosamente"
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al crear el perfume"
        })
        console.error("Error al guardar el perfume", e)
    }
});

app.put('/perfumes/:id', async (req, res)=> {
    const {id} = req.params;

    try {
        await Perfume.findByIdAndUpdate(id, req.body); 
        res.status(201).json({
            message: `perfume con id ${id} actualizado exitosamente`
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al actualizar el perfume"
        })
        console.error("Error al actualizar el perfume", e)
    }
});

app.delete('/perfumes/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id)
    try {
        await Perfume.findByIdAndDelete(id); 
        res.status(201).json({
            message: `perfume con id ${id} borrado exitosamente`
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al borrar el perfume"
        })
        console.error("Error al borrar el perfume", e)
    }
})

app.listen(3000, ()=> {
    console.log("Servidor ejecutandose en puerto http://localhost:3000")
})