const dev = require('../devices/air.sensor');
const { Code } = require('../consts/response.code');

exports.controller = {

    // Get current temperature
    async getTemperature(req, res) {
        const temp = await dev.getTemperature();
        if (temp) {
            return res.status(Code.Success).json(temp);
        } else {
            return res.status(Code.SeverError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    },

    // Get current humidity
    async getHumidity(req, res) {
        const hum = await dev.getHumidity();
        if (hum) {
            return res.status(Code.Success).json(hum);
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    },

    async getTemperatureStats(req, res) {

    },

    async getHumidityStats(req, res) {

    },

}