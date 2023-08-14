import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { AccountsModel } from "../../types/account";

const Account = sequelize.define<AccountsModel>(
  "accounts",
  {
    account_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "customers",
        key: "customer_id",
      },
    },
    account_type: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    payment_details: {
      type: Sequelize.STRING(20),
    },
    charge_duration: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    throttle_pref: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    revenue_percent: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "accounts",
    paranoid: true,
    timestamps: true,
  }
);

export default Account;
