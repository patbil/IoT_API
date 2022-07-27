const queriesModel = require('../database/queries.model');

// Get all users from database
function getAll() {
    const query = `SELECT * FROM Users`;
    return queriesModel.oneParams(query);
}

// Get user by id
function getById(id){
    const query = `SELECT * FROM Users WHERE id = ${id}`;
    return queriesModel.oneParams(query);
}

// Remove the user with id
function removeUser(id){
    const query = `DELETE FROM Users WHERE id = ${id}`;
    return queriesModel.oneParams(query);
}

// function update user by id
function updateUser(data, id){
    const query = `UPDATE Users SET ? WHERE id = ${id}`;
    return queriesModel.twoParams(data, id); 
}

module.exports = { getAll, getById, removeUser }