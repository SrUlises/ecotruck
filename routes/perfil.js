const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');

// Ruta para obtener datos del usuario
router.get('/perfil/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil del usuario:', error);
        res.status(500).json({ message: 'Error al obtener datos del perfil' });
    }
});

module.exports = router;
