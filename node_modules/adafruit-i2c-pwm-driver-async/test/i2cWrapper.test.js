import I2C from '../src/i2cWrapper';

describe('I2C wrapper functions', () => {

    it('mock readBytes returns fake data', () => {
        const i2c = I2C(0x40, {}, true);
        return expect(i2c.readBytes(null, 3)).resolves.toEqual([0x00, 0x00, 0x00]);
    });

    it('mock writeBytes does nothing', () => {
        const i2c = I2C(0x40, {}, true);
        return i2c.writeBytes();
    });
});
