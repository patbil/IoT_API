const { Router } = require('express');
const { Code } = require('../consts/responseCode');
const { catchAsync } = require('../middleware/error');
const fanController = require('../controllers/fan.controller');

const router = Router();

// Get information on the current status
router.get('/', catchAsync(fanController.controller.getInfo));

// Turn on/off the fan
router.put('/:id', catchAsync(fanController.controller.turn));

// METHOD NOT ALLOW in endpoint /fan
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /fan'
}));

module.exports = router;