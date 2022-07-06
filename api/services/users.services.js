const queriesModel = require('../database/queries.model');

exports.service = {

    getAll() {
        const query = "SELECT * FROM Users";
        return queriesModel.oneParams(query);
    },

}