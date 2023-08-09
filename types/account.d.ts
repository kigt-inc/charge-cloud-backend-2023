import { Model } from "sequelize";

export interface AccountsAttributes {
  account_id: number;
  customer_id: number;
  account_type: string;
  payment_details: string;
  charge_duration: number;
  throttle_pref: string;
  revenue_percent: number;
}

export type AccountsModel = Model<AccountsAttributes> & AccountsAttributes;
