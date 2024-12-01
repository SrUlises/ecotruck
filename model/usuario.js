const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const usersSchema = moongose.Schema({
    name: {
        type: String,
        required: true,
        trim: true, // Elimina espacios al inicio y al final
        match: /^[a-zA-Z\s]+$/ // Solo permite letras y espacios
    },
    password: String,
    position: String
});

mongoose.model('users', usersSchema); 