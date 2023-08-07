import "dotenv/config";
import { Sequelize } from "sequelize";

// code to connect sequelize to MYsql
let sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USERNAME!,
  process.env.DB_PASSWORD!,
  {
    logging: function (text: any) {
      console.log(" ");
      console.log(`\x1b[35m%s\x1b[0m`, text);
      console.log(
        "------------------------------------------------------------------------------------------------------------"
      );
    },
    host: process.env.DB_HOST!,
    pool: {
      max: 10,
      min: 0,
      idle: 5000,
      acquire: 30000,
    },
    port: Number(process.env.DB_PORT!),
    dialect: "mysql",
    ssl: false,
  }
);

export default sequelize;
