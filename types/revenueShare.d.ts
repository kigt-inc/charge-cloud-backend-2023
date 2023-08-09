import { Model } from "sequelize";

export interface RevenueSharesAttributes {
  revenue_id: number;
  charge_station_id: number;
  client_id: number;
  revenue_start: Date;
  revenue_end: Date;
  revenue_amt: number;
  revenue_type: number;
  paid_collected: string;
  invoiced: string;
}

export type RevenueSharesModel = Model<RevenueSharesAttributes> &
  RevenueSharesAttributes;
