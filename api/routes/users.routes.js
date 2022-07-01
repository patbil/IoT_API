const { Router } = require('express');
const { Code } = require('../consts/responseCode');
const { catchAsync } = require('../middleware/error');
const userController = require('../controllers/users.controller');

const router = Router();

// Get all users
router.get('/', catchAsync(userController.controller.getAll));

// Get user details
router.get('/:id', catchAsync(userController.controller.getById));

// Sign up a new user
router.post('/sing-up', catchAsync(userController.controller.create));

// The endpoint leading to the login method
router.post('/sign-in', catchAsync(userController.controller.login));

// Edit existing user
router.put('/:id', catchAsync(userController.controller.modify));

// Delete user by id
router.delete('/:id', catchAsync(userController.controller.remove));

//NOT FOUND METHOD in endpoint /users
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /users'
}));

module.exports = router;