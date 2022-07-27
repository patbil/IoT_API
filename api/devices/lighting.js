const { Gpio } = require('onoff');
const { getInfo } = require('../services/lighting.services');
let lights = {}; // Object with GPIO

/** 
 Initialization of the object storing the fields with gpio objects allowing to change the state of the GPIO pin.
 It will be useful when changing pin states and when starting the API.
 */
init = async () => {
    const result = await getInfo();
    result.forEach(el => {
        lights[el.name] = new Gpio(el.address, 'out', 'both');
        lights[el.name].writeSync(el.state);
    });
    
    console.log('Lighting initialization completed successfully.');
}

// Change the state of the GPIO pin based on the location and state sent by the user.
changeStateLighting = (data) => {
    lights[data.name].writeSync(Number(data.state));
}

module.exports = { init, changeStateLighting }
