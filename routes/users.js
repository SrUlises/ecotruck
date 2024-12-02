var express = require('express');
var router = express.Router();
const bcrypt = require("bcrypt");

const moongose = require("mongoose");
const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");


const users = moongose.model("users"); //nombre de la coleccion de bd
const arduinoPort = "COM8";
const arduinoSerialPort = new SerialPort({ path: arduinoPort, baudRate: 9600 });
const parser = arduinoSerialPort.pipe(new ReadlineParser({ delimiter: "\r\n" }));

let username = "";


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


// Ruta para obtener los nombres de los usuarios
// Nueva ruta para obtener el nombre y posición por nombre de usuario
router.get('/user/:name', async (req, res) => {
  try {
    const { name } = req.params;

    // Buscar el usuario por nombre y obtener los campos necesarios
    const user = await users.findOne({ name }, 'name position email code');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Responder con los datos del usuario
    res.status(200).json({
      message: 'Datos del usuario obtenidos con éxito',
      user: {
        name: user.name,
        position: user.position,
        email: user.email,
        code: user.code
      },
    });
  } catch (error) {
    console.error('Error al obtener los datos del usuario:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});





// Ruta para manejo de inicio de sesión, voy a pegarle algo aqui 
router.post('/login', async (req, res) => {
  try {
    const { name, password } = req.body;

    // Buscar al usuario en la base de datos
    const user = await users.findOne({ name });
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (user.status === 0){
      return res.status(403).json({message: 'Tu cuenta esta desactivada. No puedes iniciar sesion'});
    }

    // Comparar la contraseña proporcionada con la almacenada
    if (user.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Respuesta exitosa
    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      user: {
        id: user._id,
        name: user.name,
        position: user.position,
        email: user.email,
        code: user.code
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


