const queriesModel = require('../database/queries.model');

// Get info about the current state of the lighting
function getInfo() {
    const query = "SELECT * FROM Lights";
    return queriesModel.oneParams(query);
}

// Update the lighting state
function update(name, state){
    const query = `UPDATE Lights SET state = ${state} WHERE name = '${name}'`;
    return queriesModel.oneParams(query);
}

module.exports = { getInfo, update }