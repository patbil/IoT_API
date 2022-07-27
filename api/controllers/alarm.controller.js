const dev = require('../devices/alarm');
const { Code } = require('../consts/response.code');
const { getInfo, turnOff, turnOnPir } = require('../services/alarm.services');

exports.controller = {

    // Get the current alarm state
    async getInfo(req, res) {
        const result = await getInfo();
        if (result.length) {
            return res.status(Code.Success).json(result);
        } else {
            return res.status(Code.NotFound).json({
                message: 'Resource not found.'
            });
        }
    },

    // Enable or disable the alarm
    async turn(req, res) {
        let result;
        if (req.body.enabled) {
            await dev.turnOnPir(); //dev
            result = await turnOnPir(); //db
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