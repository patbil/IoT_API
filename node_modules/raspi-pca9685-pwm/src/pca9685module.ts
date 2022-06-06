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

import { I2C } from 'raspi-i2c';

// Private constants originally in pca9685.ts in https://github.com/101100/pca9685
// Start citation
/*
 * src/pca9685.ts
 * https://github.com/101100/pca9685
 *
 * Library for PCA9685 I2C 16-channel PWM/servo driver.
 *
 * Copyright (c) 2015 Jason Heard
 * Licensed under the MIT license.
 */
const privateConst = {
  modeRegister1: 0x00, // MODE1
  modeRegister1Default: 0x01,
  modeRegister2: 0x01, // MODE2
  modeRegister2Default: 0x04,
  channel0OnStepLowByte: 0x06, // LED0_ON_L
  channel0OnStepHighByte: 0x07, // LED0_ON_H
  channel0OffStepLowByte: 0x08, // LED0_OFF_L
  channel0OffStepHighByte: 0x09, // LED0_OFF_H
  registersPerChannel: 4,
  allChannelsOnStepLowByte: 0xFA, // ALL_LED_ON_L
  allChannelsOnStepHighByte: 0xFB, // ALL_LED_ON_H
  allChannelsOffStepLowByte: 0xFC, // ALL_LED_OFF_L
  allChannelsOffStepHighByte: 0xFD, // ALL_LED_OFF_H
  channelFullOnOrOff: 0x10, // must be sent to the off step high byte
  preScaleRegister: 0xFE, // PRE_SCALE
  sleepBit: 0x10,
  autoIncrementOn: 0xA1,
  defaultAddress: 0x40,
  baseClockHertz: 25000000,
};
// End of citation

export const publicConst = {
  maxChannelsPerBoard: 16, // per PCA9685
  maxBoards: 62, // 6bit h/w address (saying so, it's 62)
  stepsPerCycle: 4096,
  defaultFrequency: 200 // Sufficient for LED PWM
};

/*
  PCA9685 can offset 'on timing' to decrease the current surge and EMC.
  Offset will be given so that the distance of each channel being as large as possible,
  assuming that we use channels from 0 to 15, board address given by wiring from 0,1,..
    offset = (baseClockHertz / frequency) / maxChannels * onOffset_Ch[ch]
*/
const onOffsetPerCh: number[] = [
  0x00, 0x08, 0x04, 0x0C,
  0x02, 0x0A, 0x06, 0x0E,
  0x01, 0x09, 0x05, 0x0D,
  0x03, 0x0B, 0x07, 0x0F];
const onOffsetPerBourd: number[] = [
  0x00, 0x20, 0x10, 0x30,
  0x08, 0x28, 0x18, 0x38,
  0x04, 0x34, 0x14, 0x34,
  0x0C, 0x2C, 0x1C, 0x3C,

  0x02, 0x22, 0x12, 0x32,
  0x0A, 0x2A, 0x1A, 0x3A,
  0x06, 0x26, 0x16, 0x36,
  0x0E, 0x2E, 0x1E, 0x3E,

  0x01, 0x21, 0x11, 0x31,
  0x09, 0x29, 0x19, 0x39,
  0x05, 0x25, 0x15, 0x35,
  0x0D, 0x2D, 0x1D, 0x3D,

  0x03, 0x23, 0x13, 0x33,
  0x0B, 0x2B, 0x1B, 0x3B,
  0x07, 0x27, 0x17, 0x37,
  0x0F, 0x2F]; // max 62 board.

export interface IPCA9685Module {
  readonly address: number;
  readonly board: number;
  frequency: number;

  dutyCycle(ch: number): number;
  setDutyCycle(ch: number, dutyCycleNormalized: number): void;
  reset(): void;
  channelOff(ch?: number): void;
  channelOn(ch: number): void;
}

function checkChannel (val: any): void {
  if (typeof val !== 'number' || val < 0 || val >= publicConst.maxChannelsPerBoard) {
    throw new Error(`Invalid channel ${val as string}, out of [0,${publicConst.maxChannelsPerBoard}).`);
  }
}

function checkBoard (val: any): void {
  if (typeof val !== 'number' || val < 0 || val >= publicConst.maxBoards) {
    throw new Error(`Invalid board ${val as string}, out of [0,${publicConst.maxBoards})`);
  }
}

function checkFrequency (val: any): number {
  if (typeof val !== 'number' || val <= 0) {
    throw new Error(`Invalid frequency ${val as string}: should be a non-zero, positive number.`);
  }
  const prescale = Math.floor(privateConst.baseClockHertz / publicConst.stepsPerCycle / val + 0.5);
  if (prescale < 3) {
    throw new RangeError(`Invalid frequency ${val}: exceed h/w limit.`);
  }
  if (prescale > 0xff) {
    throw new RangeError(`Invalid frequency ${val}: too low.`);
  }
  return prescale;
}

/*
  class PCA9685Module takes care of a PCA9685 board, including.
  - Initializing the baord.
  - Setting PWM frequency.
  - Reading/writing PWM duty cycle of each channel.
  - On/Off each channel.
*/

export class PCA9685Module implements IPCA9685Module {
  private static i2c: I2C = new I2C();
  private _frequency: number;
  private _address: number;

  public get address (): number { return this._address; }
  public get board (): number { return this.address - privateConst.defaultAddress; }
  public get frequency (): number { return this._frequency; }
  public set frequency (frequency: number) {
    this.setFrequency(frequency);
    this._frequency = frequency;
  }

  public setDutyCycle (ch: number, dutyCycleNormalized: number): void {
    if (dutyCycleNormalized < 0) dutyCycleNormalized = 0;
    if (dutyCycleNormalized > 1) dutyCycleNormalized = 1;

    this.setDutyCycleUInt(ch, dutyCycleNormalized * publicConst.stepsPerCycle);
  }

  public setDutyCycleUInt (ch: number, dutyCycleUInt: number): void {
    checkChannel(ch);

    dutyCycleUInt = Math.round(dutyCycleUInt);
    if (dutyCycleUInt >= publicConst.stepsPerCycle) {
      this.channelOn(ch);
      return;
    }
    if (dutyCycleUInt < 0) dutyCycleUInt = 0;

    const onStep = Math.round(publicConst.stepsPerCycle / publicConst.maxChannelsPerBoard * (onOffsetPerCh[ch] + onOffsetPerBourd[this.board] / publicConst.maxBoards));
    let offStep = onStep + dutyCycleUInt;
    /* istanbul ignore else */
    if (offStep > publicConst.stepsPerCycle) offStep -= publicConst.stepsPerCycle;

    PCA9685Module.i2c.writeByteSync(this.address, privateConst.channel0OnStepLowByte  + privateConst.registersPerChannel * ch, onStep & 0xFF);
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.channel0OnStepHighByte + privateConst.registersPerChannel * ch, (onStep >> 8) & 0x0F);
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.channel0OffStepLowByte  + privateConst.registersPerChannel * ch, offStep & 0xFF);
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.channel0OffStepHighByte + privateConst.registersPerChannel * ch, (offStep >> 8) & 0x0F);
  }

  public dutyCycleUInt (ch: number): number {
    checkChannel(ch);

    const onStepL  = PCA9685Module.i2c.readByteSync(this.address, privateConst.channel0OnStepLowByte  + privateConst.registersPerChannel * ch);
    const onStepH  = PCA9685Module.i2c.readByteSync(this.address, privateConst.channel0OnStepHighByte + privateConst.registersPerChannel * ch);
    const offStepL = PCA9685Module.i2c.readByteSync(this.address, privateConst.channel0OffStepLowByte  + privateConst.registersPerChannel * ch);
    const offStepH = PCA9685Module.i2c.readByteSync(this.address, privateConst.channel0OffStepHighByte + privateConst.registersPerChannel * ch);

    if (offStepH & privateConst.channelFullOnOrOff) {
      return 0;
    }
    if (onStepH & privateConst.channelFullOnOrOff) {
      return (privateConst.channelFullOnOrOff << 8);
    }

    let steps = (((offStepH & 0x0F) << 8) + (offStepL & 0xFF)) - (((onStepH & 0x0F) << 8) + (onStepL & 0xFF));
    if (steps < 0) steps += publicConst.stepsPerCycle;

    return steps;
  }

  public dutyCycle (ch: number): number {
    const steps = this.dutyCycleUInt(ch);
    if (steps === (privateConst.channelFullOnOrOff << 8)) return 1;
    return steps / publicConst.stepsPerCycle;
  }

  private setFrequency (frequency: number): void {
    // Following sequence is translated from
    // https://github.com/adafruit/Adafruit_CircuitPython_PCA9685/blob/master/adafruit_pca9685.py
    const prescale = checkFrequency(frequency);

    // JS/TS doesn't have sleep().
    function sleep(msec: number) {
      const goal = msec + new Date().getTime();
      while (new Date().getTime() < goal) ;
    }

    let mode1 = PCA9685Module.i2c.readByteSync(this.address, privateConst.modeRegister1);
    const sleepMode = (mode1 & 0x7F) | privateConst.sleepBit; // Sleepy
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.modeRegister1, sleepMode);
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.preScaleRegister, prescale);
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.modeRegister1, mode1); // Wakeup
    sleep(5); // wait for oscillator

    /* istanbul ignore next */
    mode1 = mode1 | privateConst.autoIncrementOn;
    /* istanbul ignore next */
    PCA9685Module.i2c.writeByteSync(this.address, privateConst.modeRegister1, mode1);
  }

  public reset (): void {
    try {
      // This is the first point an access to this.address occurs. May fail due to wrong address.
      PCA9685Module.i2c.writeByteSync(this.address, privateConst.modeRegister2, privateConst.modeRegister2Default);
      PCA9685Module.i2c.writeByteSync(this.address, privateConst.modeRegister1, privateConst.modeRegister1Default);
    }
    catch (e) {
      throw new Error(`Reset failed as ${e as string}. Does h/w exists for address ${this.address}?`);
    }
  }

  public channelOff (ch?: number): void {
    let register = 0;

    if (typeof ch === 'number') {
      checkChannel(ch);
      register = privateConst.channel0OffStepHighByte + privateConst.registersPerChannel * ch;
    } else {
      register = privateConst.allChannelsOffStepHighByte;
    }
    PCA9685Module.i2c.writeByteSync(this.address, register, privateConst.channelFullOnOrOff);
  }

  public channelOn (ch: number): void {
    let register = 0;

    checkChannel(ch);

    // We must clear channelOff bit before turn on.
    register = privateConst.channel0OffStepHighByte + privateConst.registersPerChannel * ch;
    let tmpval = PCA9685Module.i2c.readByteSync(this.address, register);
    tmpval &= (0xff ^ privateConst.channelFullOnOrOff); // Force this bit only to 0.
    PCA9685Module.i2c.writeByteSync(this.address, register, tmpval);

    // Turn on ours.
    register = privateConst.channel0OnStepHighByte + privateConst.registersPerChannel * ch;
    PCA9685Module.i2c.writeByteSync(this.address, register, privateConst.channelFullOnOrOff);
  }

  constructor (board: number, frequency = publicConst.defaultFrequency) {
    // It does not change state of the board other than reset().
    // If application should init PWM before use, it's your task.
    checkBoard(board);
    checkFrequency(frequency);
    this._address = privateConst.defaultAddress + board;
    this._frequency = publicConst.defaultFrequency;
    this.reset();
    this.frequency = frequency;
  }

  /* istanbul ignore next */
  public destroy (): void {
    // It does not change state of the board.
    // If application should turn off PWM before destroy, it's your task.
    PCA9685Module.i2c.destroy();
  }
}
