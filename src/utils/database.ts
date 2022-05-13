import { Sequelize } from "sequelize"

export const sequelize = new Sequelize(
  "node-rest-ts",
  "postgres",
  "fifalover@2021",
  {
    host: "localhost",
    dialect: "postgres",
  }
)
