var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

const moongose = require("mongoose");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");


const Usuario = moongose.model("Usuario"); //nombre de la coleccion de bd
const arduinoPort = "COM8";
const arduinoSerialPort = new SerialPort({ path: arduinoPort, baudRate: 9600 });
const parser = arduinoSerialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let username = "";


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// Ruta para obtener los nombres de los usuarios
router.get('/usuarios', async (req, res) => {
  try {
    // Trae solo los nombres de los usuarios
    const usuarios = await Usuario.find({}, 'username'); // 'nombre' es el campo que contiene el nombre
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).send('Error al obtener los datos');
  }
});



//Ruta para el inicio de sesion
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Se requieren nombre de usuario y contraseña' });
  }

  try {
    const user = await Usuario.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Verificar si la contraseña está encriptada
    let isMatch;
    if (user.password.startsWith('$2b$')) {
      isMatch = await bcrypt.compare(password, user.password); // Comparar encriptada
    } else {
      isMatch = user.password === password; // Comparar en texto plano
    }

    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error en la autenticación:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


// Apertura del puerto COM8

arduinoSerialPort.on("open", function (err) {
  if (err) {
    return console.log(err);
  }
  console.log("Exito en apertura");
});

let puerta = true; // Esto significa puerta física cerrada
parser.on("data", async function (data, err) {
  if (err) {
    return console.log(err);
  }
  console.log("valor:" + data);
  username = data.toString("utf8");

  /* if(username =="Abierto"){
         puerta = false;
         var distancia = new Sensor({
             fecha: new Date(),
             hora: new Date().getTime(),
             distancia: username,
             lectura: req.body.lectura
         });
         await distancia.save();
     }
     else if(username == "cerrado"){
         puerta = true;
         var distancia = new Sensor({
             fecha: new Date(),
             hora: new Date().getTime(),
             distancia: username,
             lectura: req.body.lectura
         });
         await distancia.save();
     }

     if(puerta == true && username == "intruso detectado"){
         var distancia = new Sensor({
             fecha: new Date(),
             hora: new Date().getTime(),
             distancia: username,
             lectura: req.body.lectura
         });
         await distancia.save();
     }*/
});

arduinoSerialPort.on("error", function (err) {
  if (err) {
    return console.log(err);
  }
});

module.exports = router;


