const { Gpio } = require("onoff");
const { getInfo, update } = require("../services/light.services");
let sensor;

init = async () => {
    const result = await getInfo(); // get info from database
    sensor = new Gpio(result.at(0).address, 'in', 'rising', {debounceTimeout: 10}); // new Gpio object - return only true (if detect)

    console.log('Light sensor initialization successful.');

    // Observe if the user allowed it / if the state is true
    if (result.at(0).state) {    
        turnOnSensor();
    }
}

// Watch the values sent by the sensor
turnOnSensor = () => {
     sensor.watch(async (err, val) => {
        if (err) {
            throw err;
        }

        console.log('Value from light sensor: ', Boolean(val));
    });
}

// Stop watching for hardware interrupts on the GPIO
turnOffSensor = () => {
    sensor.unwatchAll();
}

module.exports = { init, turnOnSensor, turnOffSensor }