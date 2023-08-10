import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UsersModel } from "../../types/user";

const User = sequelize.define<UsersModel>(
  "users",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "client_id",
      },
    },
    user_status: {
      type: Sequelize.STRING(9),
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    first_name: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "first name is a mandatory field",
        },
      },
    },
    last_name: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "last name is a mandatory field",
        },
      },
    },
    email: {
      type: Sequelize.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "email is a mandatory field",
        },
      },
    },
    phone_no: {
      type: Sequelize.STRING(15),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "phone number is a mandatory field",
        },
      },
    },
    type: {
      type: Sequelize.STRING(8),
      allowNull: false,
    },
    reset_link_token: {
      type: Sequelize.STRING,
    },
    exp_date: {
      type: Sequelize.DATE,
    },
    online_access: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    cust_admin: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
  },
  {
    tableName: "users",
    paranoid: true,
    timestamps: true,
  }
);

export default User;
