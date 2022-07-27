const dev = require('../devices/servo.driver');
const { getInfo, update } = require('../services/servo.services');
const { Code } = require('../consts/response.code');

exports.controller = {

    // Get info about the current state of servo
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

    // Change servo state
    async turn(req, res) {
        const data = req.body;
        await dev.changeStateServo(data);

        const result = await update(data.address, data.state);
        if (result.affectedRows) {
            return res.status(Code.Success).json("The servo has modified.")
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    }
}  