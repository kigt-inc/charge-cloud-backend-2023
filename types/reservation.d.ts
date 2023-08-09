import { Model } from "sequelize";

export interface ReservationsAttributes {
  reservation_id: number;
  customer_id: number;
  location_id: number;
  charge_station_id: number;
  reservation_date: Date;
  reservation_time: string;
  reservation_date_expiry: Date;
  reservation_time_expiry: string;
  reservation_status: string;
  reservation_type: string;
  reservation_creation_timestamp: Date;
}

export type ReservationsModel = Model<ReservationsAttributes> &
  ReservationsAttributes;
