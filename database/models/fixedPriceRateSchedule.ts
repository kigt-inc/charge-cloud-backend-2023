import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { FixedPriceRateSchedulesModel } from "../../types/fixedPriceRateSchedule";

const FixedPriceRateSchedule = sequelize.define<FixedPriceRateSchedulesModel>(
  "fixed_price_rate_schedules",
  {
    fixed_price_rate_schedules_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    fixed_price_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "fixed_prices",
        key: "fixed_price_id",
      },
    },
    start_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.TIME,
      allowNull: false,
    },
    rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    start_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    end_date: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    rate_schedule_type: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
  },
  {
    tableName: "fixed_price_rate_schedules",
    paranoid: true,
    timestamps: true,
  }
);

export default FixedPriceRateSchedule;
