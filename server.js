const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ROUTES - create
const userRoutes = require('./api/routes/users.routes');
//const Pir = require('./sensors/pir');
const siuro = require('./api/sensors/servo.controler');

// ROUTES - use
app.use('/users', userRoutes);

// start listening for the server
server.listen(3200, () => {
    console.log("The server API start listening on the port: 3200");
});