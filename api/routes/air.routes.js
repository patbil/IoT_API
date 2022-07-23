const { Router } = require('express');
const { Code } = require('../consts/response.code'); 
const { catchAsync } = require('../middleware/error');
const airController = require('../controllers/air.controller');

const router = Router();

// Get the current temperature
router.get('/temperature', catchAsync(airController.controller.getTemperature));

// Get the current humidity
router.get('/humidity', catchAsync(airController.controller.getHumidity));

// Get data for temperature statistics
router.get('/temperature/stats', catchAsync(airController.controller.getTemperatureStats));

// Get data for humadity statistics
router.get('/humidity/stats', catchAsync(airController.controller.getHumidityStats));

//NOT FOUND METHOD in endpoint /air
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    method: 'The requested method was not found in the endpoint /air'
}));

module.exports = router;