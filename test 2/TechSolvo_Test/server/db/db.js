import { Sequelize } from "sequelize";
//const sequelize = new Sequelize('postgres://postgres:postgres@localhost:5432/usertest');
const databaseName = "student_data";
const username = "postgres";
const password = "8080";
const host = "localhost";
const port = 5432;
const dialect = "postgres";

// Create a new Sequelize instance with the specified parameters
const sequelize = new Sequelize(databaseName, username, password, {
  host: host,
  port: port,
  dialect: dialect
});
export { sequelize };
