import { Model } from "sequelize";

export interface EnergyOfferedPeriodAttributes {
  energy_offerred_period_id: number;
  charge_record_id: number;
  energy_offerred_period_type: string;
  energy_offerred_start: Date;
  energy_offerred_end: Date;
}

export type EnergyOfferedPeriodModel = Model<EnergyOfferedPeriodAttributes> &
  EnergyOfferedPeriodAttributes;
