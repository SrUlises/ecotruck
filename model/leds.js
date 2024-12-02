const axios = require('axios');

let ledState = 'off'; // Estado inicial del LED
const esp32Ip = '172.20.10.7'; // IP fija del ESP32

// Función para controlar el LED en el ESP32
async function controlLed(state) {
    try {
        const response = await axios.post(`http://${esp32Ip}/api/control-led`, { state });
        console.log("Respuesta del ESP32:", response.data.message);
    } catch (error) {
        throw new Error('No se pudo comunicar con el ESP32.');
    }
}

// Función para obtener el estado actual del LED
function getLedState() {
    return ledState;
}

// Función para cambiar el estado del LED
async function setLedState(state) {
    if (state === 'on' || state === 'off') {
        await controlLed(state);
        ledState = state;
    } else {
        throw new Error('Estado no válido. Usa "on" o "off".');
    }
}

module.exports = {
    getLedState,
    setLedState,
};

