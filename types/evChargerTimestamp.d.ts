import { Model } from "sequelize";

export interface EVChargerTimestampsAttributes {
  ev_charger_timestamp_id: number;
  transaction_timestamps_id: number;
  serial_no: number;
  unique_id: string;
  process_indicator: string;
  status_change_timestamp: Date;
  evse_last_transaction_payment_id: string;
  evse_last_transaction_timestamp: Date;
  evse_last_transaction_amount: string;
  evse_charging_last_time_stamp: Date;
  evse_current: string;
  evse_last_current_timestamp: Date;
  evse_energy: string;
  evse_connected_to_interface: true | false;
  evse_location: string;
  evse_max_current: string;
  evse_payment_state: true | false;
  evse_app_ascreen: string;
  evse_status_code_raw: string;
  evse_status_code: string;
  remote_log: string;
  evse_temerature: string;
  evse_throttled: true | false;
  evse_voltage: string;
  evse_quickpay_enabled: true | false;
  evse_status_code_command: string;
  evse_energy_usage: number;
  EVSE_Pre_Charging_Energy?: string;
  EVSE_Throttle_Availability_Amount?: number;
}

export type EVChargerTimestampsModel = Model<EVChargerTimestampsAttributes> &
  EVChargerTimestampsAttributes;
