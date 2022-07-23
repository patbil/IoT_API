const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;

let PWM = null; // Kepp device in variable

// Initialize the device (servo driver) on the I2C bus
init = async () => {
    PWM = new Pca9685Driver({
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 650,
        debug: false
    }, (err) => {
        if (err) {
            console.log('Error: initializing controller PCA9865.');
            process.exit(-1);
        }
        console.log('PCA9865 - Initialization done.');
    });
}

// Change state servo
changeState = (data) => {
    if (data.state) {
        PWM.setPulseLength(data.address, data.rangeOn);
    } else {
        PWM.setPulseLength(data.address, data.rangeOff);
    }
}

module.exports = { init, changeState }
