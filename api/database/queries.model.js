const pool = require("./config");

// A function that returns a connection to a pooled database
function fetchConn() {
    try {
        return pool.getConnection();
    } catch (err) {
        console.error(err);
    }
}

// A query model that allows sending only one parameter, which is the query. It is primarily used to retrieve the entire resource of a table
exports.oneParams = async (q) => {
    const connection = await fetchConn();
    try {
        connection.beginTransaction();
        const result = await connection.query(q);
        connection.commit();
        return result[0];
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();
    }
}

/* A query model that allows you to send two parameters: a query and an array of data or id.
It is used primarily for inserting into the database, as well as for retrieving a record from the database on the basis of an identifier. */
exports.twoParams = async (q, data) => {
    const connection = await fetchConn();
    try {
        connection.beginTransaction();
        const result = await connection.query(q, [data]);
        connection.commit();
        return result[0];
    } catch (error) {
        errorlog.error(error);
    } finally {
        if (connection) connection.release();
    }
}
