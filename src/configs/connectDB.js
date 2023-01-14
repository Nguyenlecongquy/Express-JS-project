import DB from "./const";
const initOptions = {};
const pgp = require("pg-promise")(initOptions);

const connection = {
  host: DB.HOST,
  port: DB.PORT,
  database: DB.DATABASE,
  user: DB.USER,
  password: DB.PASSWORD,
  max: DB.MAX,
};

const db = pgp(connection);

export default db;
