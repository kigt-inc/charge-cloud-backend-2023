import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { GeoFenceRatesModel } from "../../types/geoFenceRate";

const GeoFenceRates = sequelize.define<GeoFenceRatesModel>(
  "geo_fence_rates",
  {
    geo_fence_rate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    geo_utility_fence_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "utility_geo_fences",
        key: "geo_utility_fence_id",
      },
    },
    kigt_collected_usag: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    utility_accepted_usage: {
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
    geo_fence_state: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
  },
  {
    tableName: "geo_fence_rates",
    paranoid: true,
    timestamps: true,
  }
);

export default GeoFenceRates;
