const { Router } = require('express');
const { Code } = require('../consts/resCode');

const {
    create,
    login,
    modify,
    getAll,
    getById,
    remove
} = require('../controllers/users.controller');

const router = Router();

// Sign up a new user
router.post('/singup', create);

// The endpoint leading to the login method
router.post('/signin', login);

// Edit existing user
router.post('/modify', modify);

// Get user details
router.get('/:id', getAll);

// Get all users
router.get('/', getById);

// Delete user by id
router.delete('/:id', remove);

//NOT FOUND METHOD /users
router.use((request, response) => response.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /users'
}));

module.exports = router;