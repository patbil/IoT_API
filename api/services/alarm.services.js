const queriesModel = require('../database/queries.model');

// Get data on alarm sensors
function getInfo(){
    const query = `SELECT * FROM Sensors WHERE name = 'Pir' OR name = 'Buzzer';`;
    return queriesModel.oneParams(query);
}

// Turn on alarm (PIR)
function turnOnPir(){
    const query = `UPDATE Sensors SET state = 1 WHERE name = 'Pir'`;
    return queriesModel.oneParams(query);
}

// Turn on alarm (Buzzer)
function turnOnBuzzer(){
    const query = `UPDATE Sensors SET state = 0 WHERE name = 'Buzzer'`;
    return queriesModel.oneParams(query);
}

// Turn off alarm (All sensors)
function turnOff(){
    const query = `UPDATE Sensors SET state = CASE name WHEN 'PIR' THEN 0 WHEN 'BUZZER' THEN 1 END WHERE  name IN ('Pir' , 'Buzzer')`;
    return queriesModel.oneParams(query);
}


module.exports = { getInfo, turnOnPir, turnOnBuzzer, turnOff }