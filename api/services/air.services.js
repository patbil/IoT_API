const queriesModel = require('../database/queries.model');

// Put the current level of temperature in the database
function pushTemperature(data) {
    const query = `INSERT INTO Temperature (value, timestamp) VALUES ?`;
    return queriesModel.twoParams(query, [Object.values(data)]);
}

// Put the current level of humidity in the database
function pushHumidity(data){
    const query =  `INSERT INTO Humidity (value, timestamp) VALUES ?`;
    return queriesModel.twoParams(query, [Object.values(data)]);
}

module.exports = { pushTemperature, pushHumidity }