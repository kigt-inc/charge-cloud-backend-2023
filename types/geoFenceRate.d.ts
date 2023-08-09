import { Model } from "sequelize";

export interface GeoFenceRatesAttributes {
  geo_fence_rate_id: number;
  geo_utility_fence_id: number;
  kigt_collected_usag: number;
  utility_accepted_usage: number;
  start_date: Date;
  end_date: Date;
  geo_fence_state: string;
}

export type GeoFenceRatesModel = Model<GeoFenceRatesAttributes> &
  GeoFenceRatesAttributes;
