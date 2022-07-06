const { Gpio } = require('onoff');
const lightingService = require('../services/lighting.services');
lights = {}; // Object with GPIO

/** 
 Initialization of the object storing the fields with gpio objects allowing to change the state of the GPIO pin.
 It will be useful when changing pin states and when starting the API.
 */
init = async () => {
    const result = await lightingService.services.getAll();
    result.forEach(el => {
        lights[el.name] = new Gpio(el.gpio, 'out', 'both');
        lights[el.name].writeSync(el.state);
    });
}

// Change the state of the GPIO pin based on the location and state sent by the user.
changeState = (data) => {
    lights[data.name].writeSync(data.state)
}

module.exports = { init, changeState }
