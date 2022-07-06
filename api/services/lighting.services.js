const queriesModel = require('../database/queries.model');

exports.services = {

    getAll(){
        const query = "SELECT * FROM Lights";
        return queriesModel.oneParams(query);
    }
}