import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UsersModel } from "../../types/user";
import bcrypt from "bcrypt"
import moment from "moment";

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
      allowNull: true,
      references: {
        model: "clients",
        key: "client_id",
      },
    },
    user_status: {
      type: Sequelize.STRING(9),
      allowNull: false,
      defaultValue: "active",
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value: string) {
        this.setDataValue("password", bcrypt.hashSync(value, 10));
      },
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
      allowNull: true,
    },
    reset_link_token: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    exp_date: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    online_access: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    cust_admin: {
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
    tableName: "users",
    paranoid: true,
    timestamps: true,
    hooks: {
      beforeDestroy: async function (user, fn) {
        await User.update(
          { deleted_timestamp: moment().unix().toString() },
          {
            where: {
              user_id: user.user_id,
            },
            transaction: fn.transaction,
          }
        );
      },
    },
  }
);

export default User;
