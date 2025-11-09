const express = require ('express');
const cors = require('cors');

require('dotenv').config();
const {probarConexion} = require('./configuracion/baseDatos');
//importamos la funcion del controlador de obtenerVideojuegos
const {
    obtenerVideojuegos, 
    obtenerVideojuegoPorId, 
    crearVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
} = require('./controllers/videojuegoscontrolador');

const app = express();
const PORT = process.env.PORT || 3000;

//Middlewares

app.use(cors());
app.use(express.json());

//creamos primer endpoint GET(traer info) POST(enviar info) PUT(actualizar) DELETE(borrar)
/*
app.get('/', (req,res) => {
    res.json({
        mensaje: 'Api de Videojuegos funcionando',
        estado: 'Servidor activo'
    })
})
*/

//ahora mostramos html puro en lugar del json que pusimos arriba y después comentamos
app.get('/', (req,res) => {
    res.send(`
        <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Api Videojuegos</title>
    <style>
        html{
            height:100vh;
        }
        body{
            margin:0;
            background-color: rgb(17, 16, 16);
            color: rgb(241, 234, 234);
            display:flex;
            justify-content:center;
            align-items:center;
            height:100%;
            font-family: Arial, Helvetica, sans-serif;
            text-align: center;
        }
    </style>
</head>
<body>
    <div><h1>Api de videojuegos funcionando</h1>
    <p>Servidor activo</p>
    </div>
</body>
</html>
        `)
})

app.get('/api/videojuegos', obtenerVideojuegos);
app.get('/api/videojuegos/:id', obtenerVideojuegoPorId);
app.post('/api/videojuegos', crearVideojuego);
app.put('/api/videojuegos/:id', actualizarVideojuego);
app.delete('/api/videojuegos/:id', eliminarVideojuego);

const iniciarServidor = async () => {
    try {
        await probarConexion();
        app.listen(PORT, () => {
        console.log(`🚀 El servidor está escuchando en el puerto ${PORT} y corriendo en http://localhost:${PORT}`)
});
    } catch (error) {
        console.error('Error al iniciar el servidor', error.message);
    }
}

iniciarServidor();