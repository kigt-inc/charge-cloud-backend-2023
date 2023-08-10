import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { DemandPricingModel } from "../../types/demandPricing";

const DemandPricing = sequelize.define<DemandPricingModel>(
  "demand_pricing",
  {
    demand_Price_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    demand_response_event_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "demand_response_events",
        key: "demand_response_event_id",
      },
    },
    geo_fence_rate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "geo_fence_rates",
        key: "geo_fence_rate_id",
      },
    },
    demand_power_required: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    demand_resonse_rate: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    kigt_electric_usage: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    kigt_electric_reduction: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
  },
  {
    tableName: "demand_pricing",
    paranoid: true,
    timestamps: true,
  }
);

export default DemandPricing;
