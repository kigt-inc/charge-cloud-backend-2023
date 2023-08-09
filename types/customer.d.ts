import { Model } from "sequelize";

export interface CustomersAttributes {
  customer_id: number;
  cust_first_name: string;
  cust_last_name: string;
  customer_user_id: number;
}

export type CustomersModel = Model<CustomersAttributes> & CustomersAttributes;
