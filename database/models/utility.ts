import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UtilitiesModel } from "../../types/utility";

const Utilities = sequelize.define<UtilitiesModel>(
  "utilities",
  {
    utility_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    utility_name: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "utility name is a mandatory field",
        },
      },
    },
    utility_dept: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "utility dept is a mandatory field",
        },
      },
    },
    utility_website: {
      type: Sequelize.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "utility website is a mandatory field",
        },
      },
    },
  },
  {
    tableName: "utilities",
    paranoid: true,
    timestamps: true,
  }
);

export default Utilities;
