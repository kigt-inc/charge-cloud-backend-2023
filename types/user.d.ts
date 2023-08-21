import { Model } from "sequelize";

export interface UsersAttributes {
  user_id: number;
  client_id: number;
  user_status: string;
  password: string; 
  first_name: string;
  last_name: string;
  email: string;
  phone_no: string;
  type: string;
  reset_link_token: string;
  exp_date: Date;
  online_access: string;
  cust_admin: string;
  role?: string
}

export type UsersModel = Model<UsersAttributes> & UsersAttributes;
