const mysql = require('mysql2/promise');

// Creating a database pool, it allows to execute up to 10 queries at the same time 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT
});

// Test connection
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === "PROTOCOL_CONNECTION_LOST") {
            errorlog.error("Database connection was closed.");
        }
        if (err.code === "ER_CON_COUNT_ERROR") {
            errorlog.error("Database has too many connections.");
        }
        if (err.code === "ECONNREFUSED") {
            errorlog.error("Database connection was refused.");
        }
    }
    if (connection) {
        infolog.info("Database connected successfully.");
        connection.release();
    }
});

// Acquiring a connection from the pool
pool.on('acquire', function (connection) {
    console.log("Connection %d acquired ", connection.threadId);
});

// Waiting for the available connection slot
pool.on('enqueue', function () {
    console.log("Waiting for available connection slot");
});

// Release the connection from the pool
pool.on('release', function (connection) {
    console.log("Connection %d released", connection.threadId);
});

module.exports = pool;