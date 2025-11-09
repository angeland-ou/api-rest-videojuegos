const{pool} = require('../configuracion/baseDatos');

const obtenerVideojuegos = async (req,res) =>{
    try {
        //hacemos la consulta
        const consulta = 'SELECT * FROM videojuegos ORDER BY id ASC';
        const resultado = await pool.query(consulta);
        res.json({
            exito: true,
            mensaje: 'Videojuegos obtenidos correctamente',
            datos: resultado.rows,
            total: resultado.rows.length
        });
    } catch (error) {
        console.error('Error: ', error)
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener los videojuegos',
            error: error.message
        });
    }
};

const obtenerVideojuegoPorId = async (req,res) => {
    try {
        const {id} = req.params;
        const consulta = 'SELECT * FROM videojuegos WHERE id = $1';
        const resultado = await pool.query(consulta, [id]);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }
        res.json ({
            exito: true,
            mensaje: 'Videojuego encontrado',
            datos: resultado.rows[0]

        })

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al obtener el videojuego',
            error: error.message
        });
    }
};

const crearVideojuego = async (req,res) => {
    try {
        //declaramos las variables y las obtenemos del body de la solicitud
        const {nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion} = req.body;
        //validamos los obligatorios
        if(!nombre || !genero || !plataforma || !precio){
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, genero, plataforma y precio son obligatorios'
            })
        } 
        const consulta = `INSERT INTO videojuegos (nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion];
        const resultado = await pool.query(consulta, valores);

        //se recibe respuesta
        return res.status(201).json({
            exito: true,
            mensaje: 'Videojuego creado exitosamente',
            datos: resultado.rows[0]
        })

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al crear el videojuego',
            error: error.message
        });
    }
}

const actualizarVideojuego = async (req,res) => {
    try {
        //obtenemos id a actulizar de parametro de url
        const {id} = req.params;
        //declaramos las variables y las obtenemos del body de la solicitud
        const {nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion} = req.body;
        
        //validamos los obligatorios
        if(!nombre || !genero || !plataforma || !precio){
            return res.status(400).json({
                exito: false,
                mensaje: 'Los campos nombre, genero, plataforma y precio son obligatorios'
            })
        } 

        const consulta = `
        UPDATE videojuegos
        SET nombre = $1, genero = $2, plataforma = $3, precio = $4, fecha_lanzamiento = $5, desarrollador = $6, descripcion = $7
        WHERE id = $8
        RETURNING *
        `;
        const valores = [nombre, genero, plataforma, precio, fecha_lanzamiento, desarrollador, descripcion, id];
        
        const resultado = await pool.query(consulta, valores);

        if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: 'Videojuego actualizado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al actualizar el videojuego',
            error: error.message
        });
    }
}

const eliminarVideojuego = async (req,res) => {
    try {
        //obtenemos id a borrar del parametro de url
        const {id} = req.params;

        const consulta = `
        DELETE FROM videojuegos
        WHERE id = $1
        RETURNING *
        `;
        const valores = [id];

        const resultado = await pool.query(consulta, valores);

         if (resultado.rows.length === 0) {
            return res.status(404).json({
                exito: false,
                mensaje: 'Videojuego no encontrado'
            });
        }

        return res.status(201).json({
            exito: true,
            mensaje: 'Videojuego eliminado exitosamente',
            datos: resultado.rows[0]
        });

    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({
            exito: false,
            mensaje: 'Error al eliminar el videojuego',
            error: error.message
        });
    }
}

//lo exportamos para poder usarlo en otros archivos
module.exports = {
    obtenerVideojuegos,
    obtenerVideojuegoPorId,
    crearVideojuego,
    actualizarVideojuego,
    eliminarVideojuego
};