const dev =  require('../devices/servo.driver');

exports.controller = {

    async getAll(req, res){

    },

    async turn(req, res) {
        const data = req.body;
        await dev.changeState(data);
        return res.status(200).json('Sukces')

    }
}  