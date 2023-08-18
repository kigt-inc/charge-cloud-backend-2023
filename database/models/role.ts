import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { RolesModel } from "../../types/role";

const Role = sequelize.define<RolesModel>(
  "roles",
  {
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "role name is a mandatory field",
        },
      },
    },
    role_description: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "role description is a mandatory field",
        },
      },
    },
    client_admin: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    deleted_timestamp: {
      type: Sequelize.STRING(100),
      defaultValue: "0",
      allowNull: false,
    },
  },
  {
    tableName: "roles",
    paranoid: true,
    timestamps: true,
  }
);

export default Role;
