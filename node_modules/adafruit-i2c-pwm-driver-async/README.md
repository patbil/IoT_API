# Adafruit I2C PWM Driver

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
- [License](#license)


## About

Node.js driver implementation for a PWM i2c device (PCA9685) present in these products:
- [Adafruit 16-Channel 12-bit PWM/Servo Driver - I2C interface - PCA9685](http://www.adafruit.com/products/815)
- [Adafruit 16-Channel PWM / Servo HAT for Raspberry Pi](https://www.adafruit.com/product/2327)

This project is a fork from [this project](https://github.com/dominicbosch/adafruit-i2c-pwm-driver) that is a fork from [this project](https://github.com/kaosat-dev/adafruit-i2c-pwm-driver) (original, unmaintained).<br/>
This bring the following to the original project:
- maintains promise chains
- major code cleanup and refactoring to use ES6 syntax
- improved debugging options
- unit tests
- capability to compile on non Unix systems

Try out this project with my [PWM Controller App](https://github.com/pozil/pwm-controller).


## Installation

Before installing the driver on a Raspberry Pi you need to **enable i2c**.<br/>
Follow [these steps](http://ozzmaker.com/i2c/) to enable it while ignoring the Python related instructions: you do not need to install `libi2c-dev` and `python-smbus` (first and last set of instructions).

Install the driver with this command:
```
npm i adafruit-i2c-pwm-driver-async
```

The driver requires a i2c binding to run but the binding is kept apart from the project dependencies in order to support compilation on non Unix systems.
Install the i2c binding dependency on a Raspberry Pi with this command:
```
./install-i2c.sh
```

Reminder: running this command will fail on non Unix systems.
If you wish to develop on a non Unix system, use the `isMockDriver` flag (see documentation).


## Usage

```js
const { PwmDriver, sleep } = require('adafruit-i2c-pwm-driver-async');

// Configure driver
const pwm = new PwmDriver({
  address: 0x40,
  device: '/dev/i2c-1',
  debug: true,
  isMockDriver: true // Remove this if running on a Raspberry Pi
});

// Configure min and max servo pulse lengths
const servoMin = 150; // Min pulse length out of 4096
const servoMax = 600; // Max pulse length out of 4096

const loop = () => {
  return sleep(1)
    .then(pwm.setPWM(0, 0, servoMin))
    .then(sleep(1))
    .then(pwm.setPWM(0, 0, servoMax))
    .then(loop);
};

// Initialize driver and loop
pwm.init()
  .then(pwm.setPWMFreq(50))
  .then(sleep(1))
  .then(loop)
  .catch(console.error);
```

To configure I2c on your Raspberry-pi / Beaglebone please see [here](https://npmjs.org/package/i2c)

You can find a simple example [here](https://raw.githubusercontent.com/kaosat-dev/adafruit-i2c-pwm-driver/master/examples/simple.js)


## API

`PwmDriver({address:Number, device:String, debug:Bool, i2cDebug:Bool, isMockDriver:Bool})`

Setting up a new PwmDriver

- `address`: Address of the i2c panel (defaults to 0x40)
- `device`: Device name (defaults to /dev/i2c-1)
- `debug`: Flag used to display high level debug messages (defaults to false)
- `i2cDebug`: Flag used to display low level i2c signals (defaults to false)
- `isMockDriver`: Whether to use the real i2c binding or not (defaults to false). This is usefull for compiling on non Unix systems that don't support i2c.

`pwmDriver.init()`

Initialize the PwmDriver. Only required once after `PwmDriver` constructor is called. Returns a Promise.

`pwmDriver.setPWMFreq(frequency:Number)`

Set the PWM frequency to the provided value (in hertz). Returns a Promise.

`pwmDriver.setPWM(channel:Number, on:Number, off:Number)`

Sets a single PWM channel. Returns a Promise.

`pwmDriver.setALLPWM(channel:Number, on:Number, off:Number)`

Sets all PWM channels. Returns a Promise.

`pwmDriver.stop()`

Stops PWM signals. Returns a Promise.

## License
MIT

Based on the [Adafruit's Raspberry-Pi Python Code Library](https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code.git)

>  Here is a growing collection of libraries and example python scripts
>  for controlling a variety of Adafruit electronics with a Raspberry Pi

>  In progress!
>
>  Adafruit invests time and resources providing this open source code,
>  please support Adafruit and open-source hardware by purchasing
>  products from Adafruit!
>
>  Written by Limor Fried, Kevin Townsend and Mikey Sklar for Adafruit Industries.
>  BSD license, all text above must be included in any redistribution
>
>  To download, we suggest logging into your Pi with Internet accessibility and typing:
>  git clone https://github.com/adafruit/Adafruit-Raspberry-Pi-Python-Code.git
