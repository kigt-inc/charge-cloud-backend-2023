import { Model } from "sequelize";

export interface MerchantsAttributes {
  merchant_id: number;
  merchant_name: string;
}

export type MerchantsModel = Model<MerchantsAttributes> & MerchantsAttributes;
