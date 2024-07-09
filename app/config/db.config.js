module.exports = {
  HOST: "localhost",
  USER: "postgres",
  PASSWORD: "admin",
  DB: "Finjin",
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
const URL = `postgres://postgres:Finjin123@$finjin-db.cgaxxdzsi3lt.ap-south-1.rds.amazonaws.com/postgres`;

module.exports = URL;
