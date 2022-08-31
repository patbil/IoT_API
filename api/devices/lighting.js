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

    // Socket for the signal of lighting the gate lamp - SIG-TOLG(Turn On Light Gate)
    process.on('SIGTOLG', () => {
        blinkLED();
    });
}

// Change the state of the GPIO pin based on the location and state sent by the user.
changeStateLighting = (data) => {
    lights[data.name].writeSync(Number(data.state));
}

// LED blinks when the gate is closing or opening
blinkLED = () => {
    const led = lights['Brama'];
        const timer = setInterval(() => {
            // if current pin state is 0 (off)
            if (led.readSync() === 0) { 
                led.writeSync(1); // make on
            } else {
                led.writeSync(0); // make off
            }
        }, 100);

        setTimeout(() => {
            clearInterval(timer);
            led.writeSync(0);
        }, 900);
}

module.exports = { init, changeStateLighting }
