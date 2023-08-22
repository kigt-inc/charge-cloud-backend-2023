import { Model } from "sequelize";

export interface UserTicketsAttributes {
  user_ticket_id: number;
  ticket_id: number;
  user_id: number;
}

export type UserTicketsModel = Model<UserTicketsAttributes> & UserTicketsAttributes;
