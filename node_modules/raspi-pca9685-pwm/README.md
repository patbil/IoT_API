# Raspi PCA9685 PWM

[![npm version](https://badge.fury.io/js/raspi-pca9685-pwm.svg)](https://badge.fury.io/js/raspi-pca9685-pwm)
[![Build Status](https://travis-ci.org/kchinzei/raspi-pca9685-pwm.svg?branch=fakemorph)](https://travis-ci.org/kchinzei/raspi-pca9685-pwm)
[![Coverage Status](https://coveralls.io/repos/github/kchinzei/raspi-pca9685-pwm/badge.svg?branch=fakemorph)](https://coveralls.io/github/kchinzei/raspi-pca9685-pwm?branch=fakemorph)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Hardware PWM by PCA9685.
Raspi PCA9685 PWM is built upon
[Raspi i2c](https://github.com/nebrius/raspi-i2c) to
provide PWM outputs by controlling PCA9685 via I2C connection.
It's intended to work on PCA9685 boards such as
from [Adafruit](https://www.adafruit.com/product/815).

## System Requirements

- Raspberry Pi Model B Rev 3 or newer (Not tested on older pi's) or Pi
  Zero.
- At least one PCA9685 board.
- [raspi-i2c 6.2.4](https://github.com/nebrius/raspi-i2c) or newer.
- [raspi-soft-pwm 6.0.2](https://github.com/nebrius/raspi-soft-pwm) or newer.
- Node 11.15.0 or newer (perhaps older one with ES2015, but not tested).

## Installation

Install with npm:

```Shell
npm install raspi-pca9685-pwm
```

## Example Usage

In TypeScript/ES2015:

```TypeScript
import { init } from 'raspi';
import { PCA9685PWM } from 'raspi-pca9685-pwm';
import { IPWMConfig } from 'raspi-soft-pwm';

init(() => {
    // Use channel 0 on board 0, with 2kHz PWM frequency.
    let config: IPWMConfig = { pin: 0, frequency: 2000};
    const pwm = new PCA9685PWM(config);

    pwm.write(0.5); // 50% duty cycle.
 });
```

## API

### Module Constants

`publicConst` defines convenient parameters.

```TypeScript
export const publicConst = {
    maxChannelsPerBoard: 16,   // Number of channels in a PCA9685.
    maxBoards: 62,      // Number of boards that can cascade to I2C bus.
    stepsPerCycle: 4096,    // PCA9685 has 12-bit PWM.
    defaultFrequency: 200,  // Used internally as constructor's default
}
```

### Interface and Class

This module can use `IPWMConfig` for fake-polymorphism purpose to
construct a `PCA9685PWM` object. It uses members differently from
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm).

```TypeScript
interface IPCA9685PWMConfig {
    pin: number | string; //  0 - maxChannelsPerBoard*maxBoards-1
    frequency?: number;   // in Hz.
    range?: number;       // Not used.
}
```

`pin` is the board address offset and a PWM channel.
`pin` is calculated by Eq. 1.

```
  ( pin ) = ( board# ) * maxChannelsPerBoard + ( channel# ) ... (1)
```

Both count from zero. They don't need to start from zero - if you
like to use hardware address offset 0x01, it's fine to skip 0x00.
`pin` can be in string, such as `'1'`.
Internally, the base address `0x40` is added to `board#`.

`frequency` is Hz. When omitted, defaultFrequency is used.  
`range` is not used, because PCA9685 has 12-bit (fixed) PWM.

**PCA9685PWM** is a PWM channel on a PCA9685 board.

```typescript
class PCA9685PWM {
  dutyCycle: number; // 0.0 - 1.0
  readonly ch: number;
  readonly board: number;
  readonly frequency: number; // in Hz
  readonly pins: number;

  write(dutyCycle: number): void; // Activate PWM by dutyCycle [0,1].
  on(): void; // Turn on this channel.
  off(): void; // Turn off this channel.
  allOff(): void; // Turn off all channels on the board.
}
```

### new PCA9685PWM(config: number | string | object)

Instantiates a new PWM channel on a PCA9685 board. When the first channel
is made, you may want to provide the PWM frequency by using
`IPWMConfig` object. This sets the PWM frequency of the
board. Since the frequency is set per board, when instantiating the
rest of channels you can provide the port number only instead of
`IPWMConfig`.

Currently, once you instantiate a new PWM channel, you can't change
its PWM frequency. It's not a hardware restriction and you can easily
modify the code to allow it.

If `board#` in Eq. 1 does not point physically existing board,
`new PCA9685PWM()` will throw an exception.

## Software PWM vs. Hardware PWM

You can use
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm) without paying
extra cost to buy a hardware PWM board. But you may consider using hardware PWM
if the following occasions required;

- Jitter-free output,
- Linearity at low PWM output,
- Many outputs,
- Less burden to CPU.

You can determine if you need hardware PWM, or software PWM is
sufficient for your purpose, by prototyping using
[raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm).
A prototype code may look like this (the sample code modified from
[README.md](https://github.com/nebrius/raspi-soft-pwm/#README.md).

```TypeScript
import { init } from 'raspi';
import { SoftPWM } from 'raspi-soft-pwm'; // !!

init(() => {
    const pwm = new SoftPWM('GPIO22'); // !!
    pwm.write(0.5); // 50% Duty Cycle.
});
```

(To run this example, you need `sudo`, per pigpio library requirement.)  
To modify it to use the hardware PWM, you modify two lines with `'!!'`.

### Fake polymorphism

You can also use a 'fake' polymorphism between `SoftPWM` and
`PCA9685PWM` objects. It's a fake because these objects indeed do not
share a common base class, but they have a (partially) common interface.
In javascript you can code as if there is polymorphism.
There is a convenient object function `module.createPWM()`.
Using it, you can do like:

```TypeScript
import { init } from 'raspi';
import { PCA9685PWM, module } from 'raspi-pca9685-pwm';
import { SoftPWM, IPWMConfig } from 'raspi-soft-pwm';

init(() => {
    let pwm0: PCA9685PWM | SoftPWM;
    let pwm1: PCA9685PWM | SoftPWM;

    pwm0 = module.createPWM(0);        // returns PCA9685PWM
    pwm1 = module.createPWM('GPIO22'); // returns SoftPWM

    pwm0.write(0.5);
    pwm1.write(0.5);
 });
```

`createPWM()` takes a parameter same as the constructor of
`PCA9685PWM` and `SoftPWM`. When a number or a string that can be
convertible to number is given to `pin`, `createPWM()` instantiates a
`PCA9685PWM` object. Else, a `SoftPWM` object is returned. All public
members and methods of `SoftPWM` are available in `PCA9685PWM`.

### Caution and limitation

- There is a difference in behavior of the PWM output of `SoftPWM` and `PCA9685PWM`.
  [raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm)
  uses C library of [pigpio](http://abyz.me.uk/rpi/pigpio/cif.html). Due
  to this implementation, when the process terminates, PWM outputs turn
  off. In contrast, the outputs of PCA9685 persist unless an init is sent.

- This module cannot detect how many PCA9685 boards are installed.
  If you attempt to access a port not physically existing, an exception will be thrown.

## Credits

- APIs are inherited
  [raspi-soft-pwm](https://github.com/nebrius/raspi-soft-pwm) by nebrius.
- PCA9685 access by reading [pca9685 module](https://www.npmjs.com/package/pca9685) by Jason Heard,
  [Adafruit_CircuitPython_PCA9685](https://github.com/adafruit/Adafruit_CircuitPython_PCA9685),
  and the data sheet of [PCA9685](https://www.nxp.com/products/power-management/lighting-driver-and-controller-ics/ic-led-controllers/16-channel-12-bit-pwm-fm-plus-ic-bus-led-controller:PCA9685).
- Technical information of [Adafruit PCA9685 boards](https://learn.adafruit.com/16-channel-pwm-servo-driver).

# License

The MIT License (MIT)
Copyright (c) K. Chinzei (kchinzei@gmail.com)
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
