const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const usersSchema = moongose.Schema({
    name: String,
    password: String,
    position: String
});

mongoose.model('users', usersSchema); 