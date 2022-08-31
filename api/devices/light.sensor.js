const { Gpio } = require("onoff");
const { getInfo } = require("../services/light.services");
let sensor, lastTimeChanged = 0, timeout = 60000;

init = async () => {
    const result = await getInfo(); // get info from database
    sensor = new Gpio(result.at(0).address, 'in', 'rising'); // new Gpio object - return only true (if detect)

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

        const currentTime = Date.now();
        if (lastTimeChanged > (currentTime - timeout)) {
            return;
        } else {
            lastTimeChanged = currentTime;
            process.emit('SIGBLIND'); // Send a signal to close the blind
            console.log('Value from light sensor: ', Boolean(val));
        }
    });
}

// Stop watching for hardware interrupts on the GPIO
turnOffSensor = () => {
    sensor.unwatchAll();
}

module.exports = { init, turnOnSensor, turnOffSensor }