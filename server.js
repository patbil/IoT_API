const express = require('express');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ROUTES - create
const userRoutes = require('./api/routes/users.routes');

// ROUTES - use
app.use('/user', userRoutes);

// start listening for the server
server.listen(3200, () => {
    console.log("The server API start listening on the port: 3200");
});