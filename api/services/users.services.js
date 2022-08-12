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

// Create new user
function createUser(data){
    const query = `INSERT INTO Users (name, surname, username, email, password, role) VALUES ?`;
    return queriesModel.twoParams(query, [data]);
}

// Remove the user with id
function removeUser(id){
    const query = `DELETE FROM Users WHERE id = ${id}`;
    return queriesModel.oneParams(query);
}

// function update user by id
function updateUser(data, id){
    const query = `UPDATE Users SET ? WHERE id = ${id}`;
    return queriesModel.twoParams(query, data); 
}

function userExist(email){
    const query = `SELECT id, name, surname, username, email, password, role FROM Users WHERE email = '${email}'`;
    return queriesModel.oneParams(query);
}

module.exports = { getAll, getById, removeUser, createUser, updateUser, userExist }