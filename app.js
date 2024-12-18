var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const mongoose = require("mongoose");

// Conexión a MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/proyect1", {}) // Nombre de la base de datos
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDB", err));

// Importación de modelos
require("./model/material");
require("./model/usuario");

// Importación de rutas
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var materialRouter = require('./routes/materiales');
var ledRoutes = require('./routes/led'); // Rutas para el control del LED del ESP32

var app = express();

// Configuración del motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de CORS
app.use(cors({
  origin: "*", // Permite cualquier origen (útil para desarrollo)
  methods: "GET, PUT, POST, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Rutas principales
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/materiales', materialRouter);
app.use('/api', ledRoutes); // Integración de las rutas del ESP32

// Manejo de errores 404
app.use(function (req, res, next) {
  next(createError(404));
});

// Manejador de errores
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
