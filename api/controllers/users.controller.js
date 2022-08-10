const { Code } = require('../consts/response.code');
const { getAll, getById, removeUser } = require('../services/users.services');

exports.controller = {

    async create(req, res) {
console.log("s")
    },

    async login(req, res) {

    },

    async modify(req, res) {

    },

    // Get all users 
    async getAll(req, res) {
        const result = await getAll();
        if (result.length) {
            return res.status(Code.Success).json(result);
        } else {
            return res.status(Code.NotFound).json({
                message: 'Resource not found.'
            });
        }
    },

    // Get user by id
    async getById(req, res) {
        const { id } = req.params;
        const result = await getById(id);
        if (result.length) {
            return res.status(Code.Success).json(result);
        } else {
            return res.status(Code.NotFound).json({
                message: 'Resource not found.'
            });
        }
    },

    // Remove the user with id
    async remove(req, res) {
        const { id } = req.params;
        const result = await removeUser(id);

        if(result.affectedRows){
            return res.status(Code.Success).json({
                message: 'The resource has been deleted'
            });
        } else {
            return res.status(Code.Success).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    }


}




