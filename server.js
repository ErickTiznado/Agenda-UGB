const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const methodOverride = require('method-override');
const app = express();
const cors = require('cors');
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method')); // Para utilizar PUT y DELETE con formularios

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'Tiznado',
    password: '',
    database: 'agendaugb'
});

db.connect((err) => {
    if(err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

// Endpoint de registro
app.post('/registro', (req, res) => {
    console.log(req.body);
    let nombre = req.body.nombre;
    let correo = req.body.correo;
    let contraseña = req.body.contraseña; // Recuerda cifrar esto en una aplicación real
    let año = req.body.año;

    let query = "INSERT INTO estudiante (nombre, correo, contraseña, año_academico) VALUES (?, ?, ?, ?)";
    db.query(query, [nombre, correo, contraseña, año], (err, result) => {
        if(err) {
            console.error(err);  
            res.status(500).send({error: 'Error registrando el usuario'});
        } else {
            res.send({success: 'Usuario registrado exitosamente', userId: result.insertId});
        }
    });
});

// Endpoint de inicio de sesión
app.post('/login', (req, res) => {
    console.log(req.body);

    let correo = req.body.correo;
    let contraseña = req.body.contraseña; // En una aplicación real, la contraseña debería estar cifrada
    console.log("Intento de inicio de sesión con:", correo, contraseña);

    let query = "SELECT * FROM estudiante WHERE correo = ?";
    db.query(query, [correo], (err, results) => {
        if(err) {
            return res.status(500).send({error: 'Error consultando el usuario'});
        }
        console.log("Resultado de la consulta:", results);

        // Si no se encontró el usuario o la contraseña no coincide
        if(results.length == 0 || results[0].contraseña !== contraseña) {
            return res.status(400).send({error: 'Correo o contraseña incorrectos'});
        }

        // Si todo está bien, responder exitosamente
        const responseObj = {success: 'Inicio de sesión exitoso', userId: results[0].ID}; // Asegúrate de usar el nombre de columna correcto para el ID
        console.log("Enviando respuesta:", responseObj);
        res.send(responseObj);
        
    });
});

// Endpoint para agregar clases
app.post('/agregarClase', (req, res) => {
    console.log("Solicitud recibida para /agregarClase");
    console.log("Datos recibidos:", req.body);
    
    const {
        usuario_id,
        nombre,
        profesor,
        sala,
        hora_inicio,
        hora_fin,
        dia,
        color
    } = req.body;

    let query = "INSERT INTO clases (nombre, profesor, sala, hora_inicio, hora_fin, estudiante_id, dias, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(query, [nombre, profesor, sala, hora_inicio, hora_fin, usuario_id, dia, color], (err, result) => {
        if(err) {
            console.error("Error en la consulta:", err);
            res.status(500).send({error: 'Error agregando la clase'});
        } else {
            res.send({success: 'Clase agregada exitosamente'});
        }
    });
});

// Endpoint para actualizar una clase
app.put('/actualizarClase/:id', (req, res) => {
    console.log("Solicitud recibida para /ModificarClase");
    console.log("Datos recibidos:", req.body);
    const claseId = req.params.id;
    const {
        nombre,
        profesor,
        sala,
        hora_inicio,
        hora_fin,
        dia,
        color,
        usuario_id
    } = req.body;

    let query = "UPDATE clases SET nombre=?, profesor=?, sala=?, hora_inicio=?, hora_fin=?, dias=?, color=? WHERE id=? AND estudiante_id=?";
    db.query(query, [nombre, profesor, sala, hora_inicio, hora_fin, dia, color, claseId,usuario_id], (err, result) => {
        
        if(err) {
            console.error("Error en la consulta:", err);
            res.status(500).send({error: 'Error actualizando la clase'});
        } else {
            res.send({success: 'Clase actualizada exitosamente'});
            console.log("Resultado de la actualización:", result);

        }
    });
});

// Endpoint para eliminar una clase
app.delete('/eliminarClase/:id', (req, res) => {
    const claseId = req.params.id;

    let query = "DELETE FROM clases WHERE id=?";
    db.query(query, [claseId], (err, result) => {
        if(err) {
            console.error("Error en la consulta:", err);
            res.status(500).send({error: 'Error eliminando la clase'});
        } else {
            res.send({success: 'Clase eliminada exitosamente'});
        }
    });
});

// Endpoint para obtener clases de un estudiante específico
app.get('/getClasses', (req, res) => {
    const estudiante_id = req.query.usuario_id;

    const query = "SELECT * FROM clases WHERE estudiante_id = ? ORDER BY hora_inicio ASC";
    db.query(query, [estudiante_id], (err, results) => {
        if(err) {
            console.error("Error al obtener clases:", err);
            return res.status(500).send({error: 'Error consultando las clases'});
        }
        res.send(results);
    });
});

// Endpoint para agregar bloques de trabajo
app.post('/agregarBloqueTrabajo', (req, res) => {
    console.log("Solicitud recibida para /agregarBloqueTrabajo");
    console.log("Datos recibidos:", req.body);
    
    const {
        usuario_id,
        dia,  // Nota el acento en "día"
        inicio,
        fin,
        color
    } = req.body;

    let query = "INSERT INTO horariotrabajo (día, inicio, fin, color, estudiante_id) VALUES (?, ?, ?, ?, ?)";
    db.query(query, [dia, inicio, fin, color, usuario_id], (err, result) => {
        if(err) {
            console.error("Error en la consulta:", err);
            res.status(500).send({error: 'Error agregando el bloque de trabajo'});
        } else {
            res.send({success: 'Bloque de trabajo agregado exitosamente'});
        }
    });
});

app.get('/getWorkBlocks', (req, res) => {
    const estudiante_id = req.query.usuario_id;

    const query = "SELECT * FROM horariotrabajo WHERE estudiante_id = ? ORDER BY inicio ASC";
    db.query(query, [estudiante_id], (err, results) => {
        if(err) {
            console.error("Error al obtener bloques de trabajo:", err);
            return res.status(500).send({error: 'Error consultando los bloques de trabajo'});
        }
        res.send(results);
    });
});

// Inicio del servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
