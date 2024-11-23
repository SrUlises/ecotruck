const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const UsuarioSchema = moongose.Schema({
    username: String,
    password: String,
});

mongoose.model('Usuario', UsuarioSchema);