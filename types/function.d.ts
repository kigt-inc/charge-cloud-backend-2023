import { Model } from "sequelize";

export interface FunctionsAttributes {
  function_id: number;
  sub_function_id: number;
  function_name: string;
  function_hierarchy: string;
}

export type FunctionsModel = Model<FunctionsAttributes> & FunctionsAttributes;
