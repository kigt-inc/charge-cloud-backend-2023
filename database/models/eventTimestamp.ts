import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { EventTimestampsModel } from "../../types/eventTimestamp";

const EventTimestamp = sequelize.define<EventTimestampsModel>(
  "event_timestamps",
  {
    event_timestamp_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    evse_start_app_screen: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
    evse_last_charging_timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_connected_to_interface: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    evse_pay_state: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    evse_quickpay_enabled: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    evse_status_code: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    evse_throttled: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_disable_evse: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_enable_quickPay: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_enable_remote_logging: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_get_current_and_voltage_reading: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_get_energy_reading: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_get_temperature_reading: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_pause_evse: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_reset_evse: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    server_set_current_max: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    server_set_transaction_amount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    server_update_evse: {
      type: Sequelize.STRING(5),
      allowNull: false,
    },
    charge_station_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "charge_stations",
        key: "charge_station_id",
      },
    },
  },
  {
    tableName: "event_timestamps",
    paranoid: true,
    timestamps: true,
  }
);

export default EventTimestamp;
