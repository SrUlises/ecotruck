var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');


const mongoose = require("mongoose");

mongoose
  .connect("mongodb://127.0.0.1:27017/proyect1", {})// este nombre es el de mi base de datos 
  .then(() => console.log("Conexión exitosa a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDB", err));


//importacion de modelos 
require("./model/material");
require("./model/usuario");



//importacionn de archivos de rutas 
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var materialRouter = require('./routes/materiales');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//mtodos http
app.use(cors({
  origin: "*", // Permite cualquier origen (útil para desarrollo)
  methods: "GET, PUT, POST, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  preflightContinue: false,
  optionsSuccessStatus: 204
}));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/materiales', materialRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
