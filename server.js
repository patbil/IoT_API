const express = require('express');

const server = express();

server.listen(3200, () => {
    console.log("The server API start listening on the port: 3200");
});