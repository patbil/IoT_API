const queriesModel = require('../database/queries.model');

exports.service = {

    getAll() {
        const query = "SELECT * FROM users";
        return queriesModel.oneParams(query);
    },

}