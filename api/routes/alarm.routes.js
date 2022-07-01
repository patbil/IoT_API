const { Router } = require('express');
const { Code } = require('../consts/responseCode');
const { catchAsync } = require('../middleware/error');
const alarmController = require('../controllers/alarm.controller');

const router = Router();

// Get information on the current state of the alarm
router.get('/status', catchAsync(alarmController.controller.getInfo));

// Turn on/off alarm
router.put('/', catchAsync(alarmController.controller.turn));

//NOT FOUND METHOD in endpoint /alarm
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /alarm'
}));

module.exports = router;