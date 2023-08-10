import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { UtilityGeoFencesModel } from "../../types/utilityGeoFence";

const UtilityGeoFences = sequelize.define<UtilityGeoFencesModel>(
  "utility_geo_fences",
  {
    geo_utility_fence_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    utility_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "utilities",
        key: "utility_id",
      },
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "location_id",
      },
    },
  },
  {
    tableName: "utility_geo_fences",
    paranoid: true,
    timestamps: true,
  }
);

export default UtilityGeoFences;
