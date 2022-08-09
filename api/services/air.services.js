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

function getHumidityStats(start, end) {
    const query = `SELECT * FROM Humidity WHERE timestamp BETWEEN ${start} AND ${end}`;
    return queriesModel.oneParams(query);
}

function getTemperatureStats(start, end) {
    const query = `SELECT * FROM Temperature WHERE timestamp BETWEEN ${start} AND ${end}`;
    return queriesModel.oneParams(query);
}

module.exports = { pushTemperature, pushHumidity, getTemperatureStats, getHumidityStats }