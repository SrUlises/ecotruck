const express = require('express');
const { getLedState, setLedState } = require('../model/leds');  // Asegúrate de que la ruta es correcta

const router = express.Router();

// Ruta para cambiar el estado del LED
router.post('/control-led', async (req, res) => {
    const { state } = req.body;

    try {
        await setLedState(state);
        res.json({ success: true, message: `LED ${state}` });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Ruta para obtener el estado actual del LED
router.get('/led-state', (req, res) => {
    res.json({ ledState: getLedState() });
});

module.exports = router;  // Asegúrate de exportar el router aquí
