import { Model } from "sequelize";

export interface CommandHistoryAttributes {
  command_id: number;
  charge_station_id: number;
  command_time_stamp: Date;
  command: string;
  command_desc: string;
}

export type CommandHistoryModel = Model<CommandHistoryAttributes> &
  CommandHistoryAttributes;
