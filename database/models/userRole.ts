import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UserRolesModel } from "../../types/userRole";

const UserRole = sequelize.define<UserRolesModel>(
  "user_roles",
  {
    user_role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    role_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "roles",
        key: "role_id",
      },
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
    },
    user_function_role_entitlements_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "user_function_entitlements",
        key: "user_function_entitlements_id",
      },
    }
  },
  {
    tableName: "user_roles",
    paranoid: true,
    timestamps: true,
  }
);

export default UserRole;
