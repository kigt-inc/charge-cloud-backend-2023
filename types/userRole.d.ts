import { Model } from "sequelize";

export interface UserRolesAttributes {
  user_role_id: number;
  role_id: number;
  user_id: number;
  user_function_role_entitlements_id: number;
  role_status: string;
  date_changes: Date;
}

export type UserRolesModel = Model<UserRolesAttributes> & UserRolesAttributes;
