const mongoose = require("mongoose");

const MaterialSchema = mongoose.Schema({
    tipoPlastico: { type: String, required: true },
    codigoReciclaje: { type: String, required: true },
    color: { type: String, required: true },
    pesoAprox: { type: String, required: true },
    contaminantes: { type: String, required: true },
    fechaIngreso: { type: Date, default: Date.now },
    proveedor: { type: String, required: true },
    observaciones: { type: String },
});

module.exports = mongoose.model("Material", MaterialSchema);
