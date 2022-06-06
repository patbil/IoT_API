import PwmDriver from '../src/pwmDriver';

describe('PWM Driver', () => {

    let driver;

    beforeEach(() => {
        driver = new PwmDriver({isMockDriver: true});
    });

    const getMockReturningPromise = returnValue => {
        const mock = jest.fn();
        mock.mockReturnValue(new Promise(resolve => resolve(returnValue)));
        return mock;
    }

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('constructs with mock i2c', () => {
        expect(driver.i2c).not.toBeNull();
    });

    it('inits', () => {
        const setAllPWM = getMockReturningPromise();
        const readBytes = getMockReturningPromise();
        const writeBytes = getMockReturningPromise();

        driver.setAllPWM = setAllPWM;
        driver.i2c = { readBytes, writeBytes };
        
        return new Promise(resolve => {
            driver.init().then(() => {
                // setAllPWM(0,0) called once
                expect(setAllPWM.mock.calls.length).toBe(1);
                expect(setAllPWM.mock.calls[0][0]).toBe(0);
                expect(setAllPWM.mock.calls[0][1]).toBe(0);
                
                expect(readBytes.mock.calls.length).toBe(1);
                expect(writeBytes.mock.calls.length).toBe(3);
                resolve();
            });
        });
    });

    it('setPWMFreq', () => {
        const readBytes = getMockReturningPromise(0x00);
        const writeBytes = getMockReturningPromise();
        driver.i2c = { readBytes, writeBytes };

        return new Promise(resolve => {
            driver.setPWMFreq(0).then(() => {
                expect(readBytes.mock.calls.length).toBe(1);
                expect(writeBytes.mock.calls.length).toBe(4);
                resolve();
            });
        });
    });

    it('setPWM', () => {
        const writeBytes = getMockReturningPromise();
        driver.i2c = { writeBytes };

        return new Promise(resolve => {
            driver.setPWM(1, 2, 3).then(() => {
                expect(writeBytes.mock.calls.length).toBe(4);
                resolve();
            });
        });
    });

    it('setAllPWM', () => {
        const writeBytes = getMockReturningPromise();
        driver.i2c = { writeBytes };

        return new Promise(resolve => {
            driver.setAllPWM(1, 2).then(() => {
                expect(writeBytes.mock.calls.length).toBe(4);
                resolve();
            });
        });
    });

    it('stop', () => {
        const writeBytes = getMockReturningPromise();
        driver.i2c = { writeBytes };

        return new Promise(resolve => {
            driver.stop().then(() => {
                expect(writeBytes.mock.calls.length).toBe(1);
                resolve();
            });
        });
    });
});
