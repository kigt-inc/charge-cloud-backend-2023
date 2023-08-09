import { Model } from "sequelize";

export interface UtilitiesAttributes {
  utility_id: number;
  utility_name: string;
  utility_dept: string;
  utility_website: string;
}

export type UtilitiesModel = Model<UtilitiesAttributes> & UtilitiesAttributes;
