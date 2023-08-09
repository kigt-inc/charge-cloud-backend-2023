import { Model } from "sequelize";

export interface UserFunctionEntitlementsAttributes {
  user_function_entitlements_id: number;
  user_function_id: number;
  user_entitlement_status: string;
}

export type UserFunctionEntitlementsModel =
  Model<UserFunctionEntitlementsAttributes> &
    UserFunctionEntitlementsAttributes;
