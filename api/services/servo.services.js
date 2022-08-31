const queriesModel = require('../database/queries.model');

// Get info about the current state of the servos
function getInfo(){
    const query = `SELECT * FROM Servos`;
    return queriesModel.oneParams(query);
}

// Get info about the current state of the blind servo
function getBlindState(){
    const query = `SELECT * FROM Servos WHERE name = 'Roleta'`;
    return queriesModel.oneParams(query);
}

// Update the servo state
function update(address, state){
    const query = `UPDATE Servos SET state = ${state} WHERE address = ${address}`;
    return queriesModel.oneParams(query);
}

module.exports = { getInfo, update, getBlindState }
