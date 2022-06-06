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

export * from './pca9685module';
export * from './pca9685pwm';
