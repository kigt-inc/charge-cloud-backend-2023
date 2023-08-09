import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { CustomersModel } from "../../types/customer";

const Customer = sequelize.define<CustomersModel>(
  "customers",
  {
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    cust_first_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "customer first name is a mandatory field",
        },
      },
    },
    cust_last_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "customer last name is a mandatory field",
        },
      },
    },
    customer_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    //   references: {
    //     model: "users",
    //     key: "user_id",
    //   },
    },
  },
  {
    tableName: "customers",
    paranoid: true,
    timestamps: true,
  }
);

export default Customer;
