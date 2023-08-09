import { Model } from "sequelize";

export interface RolesAttributes {
  role_id: number;
  role_name: string;
  role_description: string;
  client_admin: string;
}

export type RolesModel = Model<RolesAttributes> & RolesAttributes;
