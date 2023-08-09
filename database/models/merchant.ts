import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { MerchantsModel } from "../../types/merchant";

const Merchant = sequelize.define<MerchantsModel>(
  "merchants",
  {
    merchant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    merchant_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "merchant name is a mandatory field",
        },
      },
    },
  },
  {
    tableName: "merchants",
    paranoid: true,
    timestamps: true,
  }
);

export default Merchant;
