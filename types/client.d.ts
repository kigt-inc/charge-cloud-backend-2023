import { Model } from "sequelize";

export interface ClientsAttributes {
  client_id: number;
  user_id: number;
  client_type: string;
  client_name: string;
  client_addr1: string;
  client_addr2: string;
  state_province: string;
  city: string;
  country: string;
  zip: string;
  reporting_freq: string;
}

export type ClientsModel = Model<ClientsAttributes> & ClientsAttributes;
