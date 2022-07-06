require("dotenv").config({ path: 'config/.env' });

const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// Import routes
const airRoutes = require('./api/routes/air.routes');
const alarmRoutes = require('./api/routes/alarm.routes');
const doorsRoutes = require('./api/routes/doors.routes');
const lightRoutes = require('./api/routes/light.routes');
const lightingRoutes = require('./api/routes/lighting.routes');
const userRoutes = require('./api/routes/users.routes');

// Imports devices
const lighting = require('./api/devices/lighting');

// Main endpoints
app.use('/air', airRoutes);
app.use('/alarm', alarmRoutes);
app.use('/doors', doorsRoutes);
app.use('/light', lightRoutes);
app.use('/lighting', lightingRoutes);
app.use('/users', userRoutes);

// Init devices
lighting.init();

// Start listening for the server
server.listen(process.env.SERVER_PORT, () => {
    console.log("The server API start listening.");
});
