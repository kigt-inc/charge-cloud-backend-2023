import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { FixedPricesModel } from "../../types/fixedPrice";

const FixedPrice = sequelize.define<FixedPricesModel>(
  "fixed_prices",
  {
    fixed_price_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "location_id",
      },
    },
    expiry_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    fixed_price_amt: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    kigt_fixed_price: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "fixed_prices",
    paranoid: true,
    timestamps: true,
  }
);

export default FixedPrice;
