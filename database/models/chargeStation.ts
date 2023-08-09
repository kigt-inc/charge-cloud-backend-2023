import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { ChargeStationsModel } from "../../types/chargeStation";

const ChargeStations = sequelize.define<ChargeStationsModel>(
  "charge_stations",
  {
    charge_station_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "locations",
        key: "location_id",
      },
    },
    merchant_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "merchants",
        key: "merchant_id",
      },
    },
    ev_charger_serial_no: {
      type: Sequelize.STRING(30),
      allowNull: false,
    },
    site_location_identifier: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    ev_charger_desc: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    evse_serial_no: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    terminal_serial_No: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    interface_serial_no: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    kiosk_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    product_type: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    evse_app_screen: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    evse_payment_state: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    evse_quickpay: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    evse_status_code: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    evse_throttled: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    evse_max_current: {
      type: Sequelize.INTEGER,
    },
    evse_temperature: {
      type: Sequelize.INTEGER,
    },
    evse_current: {
      type: Sequelize.INTEGER,
    },
    evse_last_charging_timeStamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_connected_interface: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    evse_voltage: {
      type: Sequelize.INTEGER,
    },
    remote_log: {
      type: Sequelize.STRING(100),
    },
    mac_address: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    occupancy_detector: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    connector_electrical_type: {
      type: Sequelize.STRING(2),
      allowNull: false,
    },
    connector_type: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    charge_station_status: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    connector_status: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
  },
  {
    tableName: "charge_stations",
    paranoid: true,
    timestamps: true,
  }
);

export default ChargeStations;
