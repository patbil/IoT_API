const { Gpio } = require("onoff");
const { getAll, turnOnBuzzer } = require("../services/alarm.services");
let pir, buzzer;

init = async () => {
    const result = await getAll();

    await result.forEach(el => {
        if (el.name === 'Buzzer') {
            buzzer = new Gpio(el.address, 'out', 'both');
            buzzer.writeSync(el.state);
        }
        if (el.name === 'Pir') {
            pir = new Gpio(el.address, 'in', 'rising', { debounceTimeout: 10 })
            if (el.state) {
                turnOnPir();
            }
        }
    });
}

// Turn on motion sensor listening
turnOnPir = () => {
    pir.watch(async (err, val) => {
        if (err) {
            throw err;
        }

        buzzer.writeSync(Number(!val));
        console.log('Value from PIR: ', Boolean(val));

        // Update record in database
        await turnOnBuzzer();
    });
}

// Turn off alarm
turnOffAlarm = () => {
    pir.unwatchAll();
    buzzer.writeSync(1);
}

module.exports = { init, turnOnPir, turnOffAlarm }
