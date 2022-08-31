const i2cBus = require("i2c-bus");
const Pca9685Driver = require("pca9685").Pca9685Driver;
const { getInfo, getBlindState, update } = require("../services/servo.services");

let PWM = null; // Keep device in variable

// Initialize the device (servo driver) on the I2C bus
init = async () => {
    PWM = new Pca9685Driver({
        i2c: i2cBus.openSync(1),
        address: 0x40,
        frequency: 50,
        debug: false
    }, (err) => {
        if (err) {
            console.log('Error: initializing controller PCA9865.');
            process.exit(-1);
        }
        console.log('PCA9865 - Initialization done.');
    });

    // Set the initial states of the servos based on the database
    const result = await getInfo();
    result.forEach(el => {
        changeStateServo(el);
    });

    // Light detection signal socket - close the blind
    process.on('SIGBLIND', () => {
        closeBlind();
    });
}

// Change state servo
changeStateServo = (data) => {
    if (data.state) {
        PWM.setPulseLength(data.address, data.rangeOff);
    } else {
        PWM.setPulseLength(data.address, data.rangeOn);
    }
}

// Close the blind if light is detected
closeBlind = async () => {
    const result = await getBlindState();
    const blind = result.at(0);
    if (!blind.state) {
        blind.state = true;
        changeStateServo(blind);
        update(blind.address, 1);
    }
    return;
}

module.exports = { init, changeStateServo }
