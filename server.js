const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);

const airRoutes = require('./api/routes/air.routes');
const alarmRoutes = require('./api/routes/alarm.routes');
const doorsRoutes = require('./api/routes/doors.routes');
const fanRoutes = require('./api/routes/fan.routes');
const lightRoutes = require('./api/routes/light.routes');
const lightingRoutes = require('./api/routes/lighting.routes');
const userRoutes = require('./api/routes/users.routes');

// Main endpoints
app.use('/air', airRoutes);
app.use('/alarm', alarmRoutes);
app.use('/doors', doorsRoutes);
app.use('/fan', fanRoutes);
app.use('/light', lightRoutes);
app.use('/lighting', lightingRoutes);
app.use('/users', userRoutes);

// Start listening for the server
server.listen(3200, () => {
    console.log("The server API start listening on the port: 3200");
});

//const Pir = require('./sensors/pir');
// const siuro = require('./api/sensors/servo.controler');
// const test = require('./api/sensors/pir')