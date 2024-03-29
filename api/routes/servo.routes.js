const { Router } = require('express');
const { Code } = require('../consts/response.code');
const { catchAsync } = require('../middleware/error');
const servoController = require('../controllers/servo.controller');

const router = Router();

// Get all the information about the door / servos from the database - id, state, location
router.get('/state', catchAsync(servoController.controller.getInfo));

// Open / close the door
router.put('/', catchAsync(servoController.controller.turn));

//NOT FOUND METHOD in endpoint /doors
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /servo'
}));

module.exports = router;