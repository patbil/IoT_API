const queriesModel = require('../database/queries.model');

// Get the current lighting state
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