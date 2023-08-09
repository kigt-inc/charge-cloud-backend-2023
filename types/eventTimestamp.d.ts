import { Model } from "sequelize";

export interface EventTimestampsAttributes {
  event_timestamp_id: number;
  evse_start_app_screen: string;
  evse_last_charging_timestamp: Date;
  evse_connected_to_interface: string;
  evse_pay_state: string;
  evse_quickpay_enabled: string;
  evse_status_code: string;
  evse_throttled: string;
  server_disable_evse: string;
  server_enable_quickPay: string;
  server_enable_remote_logging: string;
  server_get_current_and_voltage_reading: string;
  server_get_energy_reading: string;
  server_get_temperature_reading: string;
  server_pause_evse: string;
  server_reset_evse: string;
  server_set_current_max: number;
  server_set_transaction_amount: number;
  server_update_evse: string;
  charge_station_id: number;
}

export type EventTimestampsModel = Model<EventTimestampsAttributes> &
  EventTimestampsAttributes;
