const Sequelize = require("sequelize");

const dbConfig = require("./db.config");
const Pool = require("pg");
const sequelize = new Sequelize({
  dialect: "postgres", // Specify the dialect (e.g., 'postgres', 'mysql', 'sqlite')
  host: "finjin-db.cgaxxdzsi3lt.ap-south-1.rds.amazonaws.com",
  port: 5432, // PostgreSQL default port
  username: "postgres",
  password: "Finjin123",
  database: "postgres",
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Use this if you encounter SSL verification errors
    },
  },

  // dialect: 'postgres',
  // // username: 'postgres',
  // host: 'localhost',
  // database: 'FinjinLocal',
  // password: 'admin',
  // port: 5432,
});
module.exports = sequelize;

//const db = {};
// db.Sequelize = Sequelize;
// db.sequelize = sequelize;l̥l̥l̥̥
//db.tutorials = require("./tutorial.model.js")(sequelize, Sequelize);
//require('../../models/dsa/dsaModel')

//module.exports = db;l̥l̥l̥
