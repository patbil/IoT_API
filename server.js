require("dotenv").config({ path: 'config/.env' });

const express = require('express');
const http = require('http');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Import routes
const airRoutes = require('./api/routes/air.routes');
const alarmRoutes = require('./api/routes/alarm.routes');
const servoRoutes = require('./api/routes/servo.routes');
const lightRoutes = require('./api/routes/light.routes');
const lightingRoutes = require('./api/routes/lighting.routes');
const userRoutes = require('./api/routes/users.routes');

// Imports devices
const airSensor = require('./api/devices/air.sensor');
const alarm = require('./api/devices/alarm');
const lightSensor = require('./api/devices/light.sensor');
const lighting = require('./api/devices/lighting');
const servoDriver = require('./api/devices/servo.driver');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Main endpoints
app.use('/air', airRoutes);
app.use('/alarm', alarmRoutes);
app.use('/light', lightRoutes);
app.use('/lighting', lightingRoutes);
app.use('/users', userRoutes);
app.use('/servo', servoRoutes);

// Init devices
airSensor.init();
lightSensor.init();
lighting.init();
servoDriver.init();
alarm.init();

// Start listening for the server
server.listen(process.env.SERVER_PORT, () => {
    console.log("The server API start listening.");
});
