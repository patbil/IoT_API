/*
The MIT License (MIT)

Copyright (c) Kiyo Chinzei (kchinzei@gmail.com)

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
*/

/*
   Raspi-PCA9685-pwm - Hardware PWM by PCA9685 via I2C on the Raspberry Pi.

   Make Asayake to Wake Project.
   Kiyo Chinzei
   https://github.com/kchinzei/raspi-pca9685-pwm

   Raspi-pca9685-pwm is built upon raspi-i2c, submodule of Raspi.js
      https://www.npmjs.com/package/raspi
   I also looked at pca9685 module in npm.
      https://www.npmjs.com/package/pca9685
      https://github.com/101100/pca9685
   I also learned from Adafruit PCA9685 python code
      https://github.com/adafruit/Adafruit_Python_PCA9685/
   But the API is modified to be consistent to raspi-soft-pwm.
      https://github.com/nebrius/raspi-soft-pwm

   Due to this design, you can switch easily between
   raspi-soft-pwm and raspi-pca9685-pwm.
*/

import { PCA9685Module, publicConst } from './pca9685module';
import { SoftPWM } from 'raspi-soft-pwm';
import { IPWMConfig } from 'raspi-soft-pwm';

export interface IPWMFactory {
  createPWM: (config: number | string | IPWMConfig) => SoftPWM | PCA9685PWM;
}

export interface IPCA9685PWM {
  readonly ch: number;
  readonly board: number;
  readonly frequency: number;
  readonly dutyCycle: number;
  write(dutyCycle: number): void;
  on(): void;
  off(): void;
  allOff(): void;

  // For SoftPWM compatibility purpose
  readonly range: number;
  readonly pins: number;
}

function checkPin (config: number | string | IPWMConfig): number | string {
  // It preserves channel's current PWM status.
  // If application should init PWM before use, it's your task.

  let pin: (number | string) = 0;
  if (typeof config === 'object') {
    pin = config.pin;
  } else {
    pin = config;
  }
  return pin;
}

export class PCA9685PWM implements IPCA9685PWM {
  private static _pca9685: PCA9685Module[] = new Array(publicConst.maxBoards) as PCA9685Module[];
  private _ch = 0;
  private _board = 0;

  public get ch (): number { return this._ch; }
  public get board (): number { return this._board; }
  public get frequency (): number { return PCA9685PWM._pca9685[this.board].frequency; }
  public get dutyCycle (): number { return this.read(); }

  /* For SoftPWM compatibility */
  /* istanbul ignore next */
  public get range (): number { return publicConst.stepsPerCycle; }
  /* istanbul ignore next */
  public get pins (): number { return this.ch + this.board * publicConst.maxChannelsPerBoard; }

  public write (dutyCycle: number): void {
    PCA9685PWM._pca9685[this.board].setDutyCycle(this.ch, dutyCycle);
  }

  private read (): number {
    return PCA9685PWM._pca9685[this.board].dutyCycle(this.ch);
  }

  public on (): void {
    PCA9685PWM._pca9685[this.board].channelOn(this.ch);
  }

  public off (): void {
    PCA9685PWM._pca9685[this.board].channelOff(this.ch);
  }

  public allOff (): void {
    PCA9685PWM._pca9685[this.board].channelOff();
  }

  constructor (config: number | string | IPWMConfig) {
    const pin: (number | string) = checkPin(config);

    let port = 0;
    if (typeof pin === 'number') {
      port = pin;
    } else {
      port = Number(pin);
      if (isNaN(port)) {
        throw new RangeError(`Invalid port number '${pin}', not a number string).`);
      }
    }
    if (port < 0 || port >= publicConst.maxChannelsPerBoard * publicConst.maxBoards) {
      throw new RangeError(`Invalid port number ${port}, out of [0,${publicConst.maxChannelsPerBoard * publicConst.maxBoards}).`);
    }
    this._ch = port % publicConst.maxChannelsPerBoard;
    this._board = Math.floor(port / publicConst.maxChannelsPerBoard);

    let frequency = publicConst.defaultFrequency;
    if (typeof config === 'object' && typeof config.frequency === 'number') {
      frequency = config.frequency;
    }

    if (typeof PCA9685PWM._pca9685[this.board] === 'undefined') {
      PCA9685PWM._pca9685[this.board] = new PCA9685Module(this.board, frequency);
    }
    this.read();
  }

  /* istanbul ignore next */
  public destroy (): void {
    // It does not destroy I2C communication.
  }
}

export const module: IPWMFactory = {
  /*
    Factory function that return either SoftPWM or PCA9635PWM.
    if given pin is a non-number string (e.g., 'GPIO22'), SoftPWN.
    if gicen pin represents a number (e.g., 22 or '022'), PCA9685PWM.
  */
  createPWM (config: number | string | IPWMConfig) {
    const pin: (number | string) = checkPin(config);

    if (typeof pin === 'string' && isNaN(Number(pin))) {
      return new SoftPWM(config);
    }
    return new PCA9685PWM(config);
  }
};
