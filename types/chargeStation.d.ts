import { Model } from "sequelize";

export interface ChargeStationsAttributes {
  charge_station_id: number;
  location_id: number;
  merchant_id: number;
  ev_charger_serial_no: string;
  site_location_identifier: string;
  ev_charger_desc: string;
  evse_serial_no: number;
  terminal_serial_No: number;
  interface_serial_no: number;
  kiosk_id: number;
  product_type: string;
  evse_app_screen: string;
  evse_payment_state: string;
  evse_quickpay: string;
  evse_status_code: number;
  evse_throttled: string;
  evse_max_current: number;
  evse_temperature: number;
  evse_current: number;
  evse_last_charging_timeStamp: Date;
  evse_connected_interface: string;
  evse_voltage: number;
  remote_log: string;
  mac_address: string;
  occupancy_detector: string;
  connector_electrical_type: string;
  connector_type: string;
  charge_station_status: string;
  connector_status: string;
}

export type ChargeStationsModel = Model<ChargeStationsAttributes> &
  ChargeStationsAttributes;
