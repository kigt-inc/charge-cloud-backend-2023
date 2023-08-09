import { Model } from "sequelize";

export interface FixedPricesAttributes {
  fixed_price_id: number;
  location_id: number;
  expiry_date: Date;
  fixed_price_amt: number;
  kigt_fixed_price: number;
}

export type FixedPricesModel = Model<FixedPricesAttributes> &
  FixedPricesAttributes;
