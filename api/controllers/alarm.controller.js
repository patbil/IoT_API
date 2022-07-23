const dev = require('../devices/alarm');
const { Code } = require('../consts/response.code');
const { getAll, turnOff, turnOnPir } = require('../services/alarm.services');

exports.controller = {

    // Get the current alarm state
    async getInfo(req, res) {
        const result = await getAll();
        if (result) {
            return res.status(Code.Success).json(result);
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    },

    // Enable or disable the alarm
    async turn(req, res) {
        let result;
        if (req.body.enabled) {
            await dev.turnOnPir();
            result = await turnOnPir();
        } else {
            await dev.turnOffAlarm();
            result = await turnOff();
        }
        if (result.affectedRows) {
            return res.status(Code.Success).json("The alarm has been modified.");
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    }
}