const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    code: String,
    name: String,
    type: String,
    position: String,
    email: String,
    password: String,
    status: String,
    updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model('users', usuarioSchema);
