const { getInfo, update } = require('../services/lighting.services');
const dev = require('../devices/lighting');
const { Code } = require('../consts/response.code');

exports.controller = {

    // Get info about the current state of lights
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

    // Turn on one light
    async turn(req, res) {
        const data = req.body;
        await dev.changeStateLighting(data);

        const result = await update(data.name, data.state);
        if (result.affectedRows) {
            return res.status(Code.Success).json('The lighting has modified.');
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something goes wrong. Please try again in a few moments.'
            });
        }
    },

    // Turn off/on all the lights outside
    async turnAllOutside(req, res) {
        const val = Number(req.body.enabled);
        const result = await getInfo();

        result.filter(el => el.location === 'out').forEach(async (el) => {
            dev.changeStateLighting({ name: el.name, state: val });
            await update(el.name, val);
        });

        return res.status(Code.Success).json("Succces turn lighting");
    },

    // Turn off/on all the lights outside
    async turnAllInside(req, res) {
        const val = Number(req.body.enabled);
        const result = await getInfo();

        result.filter(el => el.location === 'in').forEach(async (el) => {
            dev.changeStateLighting({ name: el.name, state: val });
            await update(el.name, val);
        });

        return res.status(Code.Success).json("Succces turn lighting")
    }
}
