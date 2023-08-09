import { Model } from "sequelize";

export interface UtilityProgramsAttributes {
  utility_program_id: number;
  utility_id: number;
  program_price: number;
}

export type UtilityProgramsModel = Model<UtilityProgramsAttributes> &
  UtilityProgramsAttributes;
