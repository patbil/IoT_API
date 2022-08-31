const { Code } = require('../consts/response.code');
const { hashPassword, compare } = require('../helper/password');
const { getAll, getById, removeUser, createUser, updateUser, userExist } = require('../services/users.services');
const jwt = require("jsonwebtoken");

exports.controller = {

    // Create new user
    async create(req, res) {
        req.body.password = await hashPassword(req.body.password);
        delete req.body.password_confirm;
        const result = await createUser(Object.values(req.body));
        if (result.affectedRows) {
            return res.status(Code.Success).json({
                message: 'The user has been created.'
            });
        } else {
            return res.status(Code.ServerError).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
    },

    async login(req, res) {
        const { email, password } = req.body;
        const user = await userExist(email);
        if (user.length) {
            const comparison = compare(password, user.at(0).password);
            if (comparison) {
                const userDetails = (({ id, name, surname, role }) => ({ id, name, surname, role }))(user.at(0));
                const token = jwt.sign({
                    userId: userDetails.id
                },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: '2h'
                    });
                return res.status(Code.Success).json({
                    token: token,
                    expiresIn: 7200,
                    user: userDetails
                });
            } else {
                res.status(Code.Unauthorized).json({
                    message: "Invalid email or password"
                });
            }
        } else {
            res.status(Code.Unauthorized).json({
                message: "Invalid email or password"
            });
        }
    },

    async modify(req, res) {
        delete req.body.password_confirm;
        (req.body.password) ? req.body.password = await hashPassword(req.body.password) : delete req.body.password;

        const result = await updateUser(req.body, req.params.id);
        if (result.changedRows) {
            res.status(Code.Success).json({
                message: 'The user has been updated.'
            });
        } else {
            res.status(Code.Conflict).json({
                message: 'Something went wrong. Please try again in a few moments.'
            });
        }
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

        if (result.affectedRows) {
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




