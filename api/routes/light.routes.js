const { Router } = require('express');
const { Code } = require('../consts/response.code');
const { catchAsync } = require('../middleware/error');
const lightController = require('../controllers/light.controller');

const router = Router();

//Get the current light intensity
router.get('/', catchAsync(lightController.controller.getInfo));

// Turn on the light sensor off
router.put('/', catchAsync(lightController.controller.turn));

//NOT FOUND METHOD in endpoint /light
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /light'
}));

module.exports = router;