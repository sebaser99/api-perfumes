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

const libroSchema = new mongoose.Schema({
    titulo: String,
    autor: String
});

const Libro  = mongoose.model('Libro', libroSchema);

const libros = [
    {
        id: 1,
        titulo: "1984",
        autor: "George Orwell"
    },
    {
        id: 2,
        titulo: "Cien años de Soledad",
        autor: "Gabriel Garcia Marques"
    },
    {
        id: 3,
        titulo: "Dune",
        autor: "Frank Herbert"
    },
]

app.get('/', (req, res)=> {
    res.send("Bienvenido a tienda de libros")
})
app.get('/libros', async (req, res)=> {
    try {
        const librosDB = await Libro.find();
        res.status(200).json({data: librosDB})
    } catch(e){
        console.error("No se pudieron obtener los libros");
        res.status(500).json({message: "Error al obtener libros"})
    }
   
})

app.get('/libros/:id', async(req, res)=> {
    const id = req.params.id;
    try {
        const libro = await Libro.findById(id);
        res.status(200).json({data: libro})
    } catch(e){
        console.error("No se pudo obtener el libro");
        res.status(500).json({message: "Error al obtener  el libro"})
    }

   
    
    
})

app.post('/libros', async (req, res)=> {
    const libro = new Libro({ 
        titulo: req.body.titulo,
        autor: req.body.autor
    })

    try {
        await libro.save(); 
        res.status(201).json({
            data: libro,
            message: "libro creado exitosamente"
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al crear el libro"
        })
        console.error("Error al guardar el libro", e)
    }
});

app.put('/libros/:id', async (req, res)=> {
    const {id} = req.params;

    try {
        await Libro.findByIdAndUpdate(id, req.body); 
        res.status(201).json({
            message: `libro con id ${id} actualizado exitosamente`
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al actualizar el libro"
        })
        console.error("Error al actualizar el libro", e)
    }
});

app.delete('/libros/:id', async (req, res)=>{
    const {id} = req.params;
    console.log(id)
    try {
        await Libro.findByIdAndDelete(id); 
        res.status(201).json({
            message: `libro con id ${id} borrado exitosamente`
        })
    } catch(e){
        res.status(500).json({
            message: "Surgió un problema con el servidor al borrar el libro"
        })
        console.error("Error al borrar el libro", e)
    }
})

app.listen(3000, ()=> {
    console.log("Servidor ejecutandose en puerto http://localhost:3000")
})