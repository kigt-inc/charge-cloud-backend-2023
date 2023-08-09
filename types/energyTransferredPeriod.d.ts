import { Model } from "sequelize";

export interface EnergyTransferredPeriodAttributes {
  energy_transfer_period_id: number;
  energy_offerred_period_id: number;
  energy_transferred_start: Date;
  energy_transferred_end: Date;
}

export type EnergyTransferredPeriodModel =
  Model<EnergyTransferredPeriodAttributes> & EnergyTransferredPeriodAttributes;
