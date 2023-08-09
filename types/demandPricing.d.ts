import { Model } from "sequelize";

export interface DemandPricingAttributes {
  demand_Price_id: number;
  demand_response_event_id: number;
  geo_fence_rate_id: number;
  demand_power_required: number;
  demand_resonse_rate: number;
  kigt_electric_usage: number;
  kigt_electric_reduction: number;
}

export type DemandPricingModel = Model<DemandPricingAttributes> &
  DemandPricingAttributes;
