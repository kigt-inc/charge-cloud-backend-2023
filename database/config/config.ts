require("dotenv").config();

console.log(process.env.DB_USERNAME, "process.env.DB_USERNAME");
console.log("-----------------");
console.log(process.env.DB_PASSWORD, "process.env.DB_PASSWORD");
console.log("-----------------");
console.log(process.env.DB_NAME, "process.env.DB_NAME");
console.log("-----------------");
console.log(process.env.DB_HOST, "process.env.DB_HOST");
console.log("-----------------");
console.log(process.env.DB_PORT, "process.env.DB_PORT");
console.log("-----------------");
console.log(process.env.PORT, "process.env.PORT");

export const username = process.env.DB_USERNAME;
export const password = process.env.DB_PASSWORD;
export const database = process.env.DB_NAME;
export const host = process.env.DB_HOST;
export const port = process.env.DB_PORT;
export const dialect = "mysql";
export const seederStorage = "json";
export const seederStoragePath = "sequelizeSeeder.json";
