const queriesModel = require('../database/queries.model');

exports.service = {

    getSensor(){
        const query = `SELECT * FROM Sensors WHERE name = 'Servo'`;
        return queriesModel.oneParams(query);
    },

    getAll(){
        const query = `SELECT * FROM `
    }

}