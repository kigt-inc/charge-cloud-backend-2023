import { Model } from "sequelize";

export interface EVChargeStationTransAttributes {
  charge_record_id: number;
  transaction_timestamp_id: number;
  customer_id: number;
  charge_station_id: number;
  certificate_id: number;
  id_evse: number;
  transaction_status: string;
  transaction_stop_reason: string;
  connector_status: string;
  event_record_type: string;
  event_start: Date;
  event_end: Date;
  event_duration: number;
  qr_count: number;
  purchase_product_id: number;
  purchase_produce_name: number;
  customer_throttle: string;
  customer_throttle_number: number;
  customer_throttle_acceptance_time: Date;
  customer_throttle_time: Date;
  meter_start: Date;
  meter_end: Date;
  kwh_session: number;
  event_trigger_reason: string;
  total_cost: number;
  Kigt_charge: number;
  utility_cost: number;
  other_cost: number;
  tariff_cost: number;
  reservation_cost: number;
  offline_indicator: string;
  authorized_indicator: string;
  realtime_db_id_type: string;
}

export type EVChargeStationTransModel = Model<EVChargeStationTransAttributes> &
  EVChargeStationTransAttributes;
