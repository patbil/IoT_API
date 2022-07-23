const queriesModel = require('../database/queries.model');

// Get info about the current state of the sensor
function getInfo(){
    const query = `SELECT * FROM Sensors WHERE name = 'Light'`;
    return queriesModel.oneParams(query);
}

// Update state
function update(state){
    const query = `UPDATE Sensors SET state = ${state} WHERE name = 'Light'`;
    return queriesModel.oneParams(query);
}

module.exports = { getInfo, update }