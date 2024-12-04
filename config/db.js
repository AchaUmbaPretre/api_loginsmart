const mysql = require("mysql");
const dotenv = require('dotenv');

dotenv.config();

const db = mysql.createPool({
    connectionLimit: 10,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La connexion avec la base de données a été perdue.');
        } else if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Trop de connexions à la base de données.');
        } else if (err.code === 'ECONNREFUSED') {
            console.error('La connexion à la base de données a été refusée.');
        }
    }
    if (connection) {
        connection.release();
    }
    return;
});

module.exports = { db };