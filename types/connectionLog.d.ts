import { Model } from "sequelize";

export interface ConnectionLogsAttributes {
  connection_log_id: number;
  message: string;
}

export type ConnectionLogsModel = Model<ConnectionLogsAttributes> &
  ConnectionLogsAttributes;
