const express = require('express');
const router = express.Router();
const Material = require("../model/material") // Ajusta la ruta según tu estructura

// Ruta para guardar un nuevo material
router.post("/", async (req, res) => {
    try {
        const nuevoMaterial = new Material({
            tipoPlastico: req.body.tipoPlastico,
            codigoReciclaje: req.body.codigoReciclaje,
            color: req.body.color,
            pesoAprox: req.body.pesoAprox,
            contaminantes: req.body.contaminantes,
            fechaIngreso: req.body.fechaIngreso,
            proveedor: req.body.proveedor,
            observaciones: req.body.observaciones,
        });

        const materialGuardado = await nuevoMaterial.save();
        res.status(201).json({ message: "Material guardado exitosamente", material: materialGuardado });
    } catch (error) {
        console.error("Error al guardar material:", error);
        res.status(500).json({ message: "Error interno del servidor", error });
    }
});

module.exports = router;
