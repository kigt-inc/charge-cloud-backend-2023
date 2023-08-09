import { Model } from "sequelize";

export interface UtilityGeoFencesAttributes {
  geo_utility_fence_id: number;
  utility_id: number;
  location_id: number;
}

export type UtilityGeoFencesModel = Model<UtilityGeoFencesAttributes> &
  UtilityGeoFencesAttributes;
