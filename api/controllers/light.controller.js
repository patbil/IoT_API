const { getInfo, update } = require("../services/light.services");
const { Code } = require('../consts/response.code');
const dev = require('../devices/light.sensor');

exports.controller = {

    // Get the current sensor status
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

    // Turn on/off the sensor
    async turn(req, res) {
        (req.body.enabled) ? await dev.turnOnSensor() : await dev.turnOffSensor();
        const result = await update(Number(req.body.enabled));
        if (result.affectedRows) {
            return res.status(Code.Success).json("The light sensor has modified.");
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    },

}