const { Router } = require('express');
const { Code } = require('../consts/responseCode');
const { catchAsync } = require('../middleware/error');
const lightController = require('../controllers/light.controller');

const router = Router();

//Get the current light intensity
router.get('/', catchAsync(lightController.controller.getLx));

// Set the maximum value of the light intensity
router.put('/', catchAsync(lightController.controller.setMax));

//NOT FOUND METHOD in endpoint /light
router.use((req, res) => res.status(Code.MethodNotAllowed).json({
    message: 'The requested method was not found in the endpoint /light'
}));

module.exports = router;