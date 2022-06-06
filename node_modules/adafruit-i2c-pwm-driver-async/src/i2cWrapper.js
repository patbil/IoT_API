/**
 * Wraps i2c readBytes, writeBytes functions into async functions
 * @param {binary} address 
 * @param {Object} param1 
 * @param {boolean} isMockDriver 
 */
export default function makeI2CWrapper(address, {device, debug}, isMockDriver) {
  // Only load I2C dependency if this is not a mock driver
  // This allows to compile on a non Linux OS
  let i2c = null;
  if (!isMockDriver) {
    const I2C = require('@abandonware/i2c');
    i2c = new I2C(address, {device});
  }

  async function readBytes(cmd, length) {
    return new Promise((resolve, reject) => {
      if (isMockDriver) {
        // Fake read data
        const fakeRead = [];
        for (let i=0; i<length; i++) {
          fakeRead.push(0x00);
        }
        resolve(fakeRead);
      } else {
        // Read actual data
        i2c.readBytes(cmd, length, (error, data) => {
          if (error) {
            return reject(error);
          }
          resolve(data);
        });
      }
    });
  };

  async function writeBytes(cmd, buf) {
    if (!(buf instanceof Array)) {
      buf = [buf];
    }
    if (debug) {
      console.log(`cmd ${cmd.toString(16)} values ${buf}`);
    }

    return new Promise((resolve, reject) => {
      if (isMockDriver) {
        // Fake write data
        resolve();
      } else {
        // Write actual data
        i2c.writeBytes(cmd, buf, (error, data) => {
          if (error) {
            return reject(error);
          }
          resolve(data);
        });
      }
    });
  };

  return {
    readBytes,
    writeBytes
  };
}
