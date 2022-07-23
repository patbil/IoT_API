const aht20 = require('aht20-sensor');
const { pushTemperature, pushHumidity } = require('../services/air.services');
let sensor;

// Device initialization method
init = async () => {
    await aht20.open().then(async (dev) => {
        // Assign the device to a variable. This will be useful for the tasks of showing the current humidity and temperature
        sensor = dev;

        // Test measurement. Show the results on the console
        const temp = await dev.temperature();
        const hum = await dev.humidity();
        
        console.log('Air sensor initialization successful. Temp: ', temp, 'Hum: ', hum);
    });

    // Fill the database with statistics, sent every 5 minutes
    setInterval(() => {
        pushStatisticTemp();
        pushStatisticHum();
    }, 300000);
}

// Get current temperature
getTemperature = async () => {
    return Math.round(await sensor.temperature());
}

// Get current humidity
getHumidity = async () => {
    return Math.round(await sensor.humidity());
}

// Push information about the current temperature to the database
pushStatisticTemp = async () => {
    const data = {
        value: Math.round(await sensor.temperature()),
        timestamp: Date.now()
    }

    // Method in service
    pushTemperature(data);
} 

// Push information about the current humidity to the database
pushStatisticHum = async () => {
    const data = {
        value: Math.round(await sensor.humidity()),
        timestamp: Date.now()
    }

    // Method in service
    pushHumidity(data);
}

module.exports = { init, getHumidity, getTemperature }