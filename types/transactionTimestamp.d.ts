import { Model } from "sequelize";

export interface TransactionTimestampsAttributes {
  transaction_timestamp_id: number;
}

export type TransactionTimestampsModel =
  Model<TransactionTimestampsAttributes> & TransactionTimestampsAttributes;
