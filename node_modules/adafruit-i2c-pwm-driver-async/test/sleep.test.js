import { sleep, usleep } from '../src/sleep';

describe('sleep functions', () => {

    it('sleep waits and resolve', () => {
        expect.assertions(1);
        return new Promise(resolve => {
            const resolved = false;
            sleep(1).then(() => {
                resolve();
            });
            expect(resolved).toBeFalsy();
        });
    });

    it('usleep waits and resolve', () => {
        expect.assertions(1);
        return new Promise(resolve => {
            const resolved = false;
            usleep(1000).then(() => {
                resolve();
            });
            expect(resolved).toBeFalsy();
        });
    });
});
