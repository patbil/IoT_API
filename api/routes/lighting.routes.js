const { Router } = require('express');
const { Code } = require('../consts/responseCode');
const { catchAsync } = require('../middleware/error');
const lightingController = require('../controllers/lighting.controller');

const router = Router();

// Get all information about lighting from the database - id, places
router.get('/', catchAsync(lightingController.controller.getAll))

// Turn on/off the light
router.put('/', catchAsync(lightingController.controller.turn));

// Turn on/off all the light outside
router.put('/allOutside', catchAsync(lightingController.controller.turnAllOutside));

// Turn on/off all the light inside
router.put('/allInside', catchAsync(lightingController.controller.turnAllInside));

//NOT FOUND METHOD in endpoint /lighting
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /lighting'
}));

module.exports = router;


