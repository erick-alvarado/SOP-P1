const mysql = require("mysql");
const util = require("util");

const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_NAME,
});

pool.getConnection(function (err, connection) {
  if (err) console.log("Something went wrong during connection attempt");
  if (connection) console.log("Mysql is connected to:", process.env.MYSQL_NAME);
  connection.release();
  return;
});

pool.query = util.promisify(pool.query);

module.exports = pool;
