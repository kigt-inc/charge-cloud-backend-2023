import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { EVChargerTimestampsModel } from "../../types/evChargerTimestamp";

const EVChargerTimestamp = sequelize.define<EVChargerTimestampsModel>(
  "ev_charger_timestamps",
  {
    ev_charger_timestamp_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_timestamps_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
      references: {
        model: "transaction_timestamps",
        key: "transaction_timestamp_id",
      },
    },
    serial_no: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    process_indicator: {
      type: Sequelize.STRING(1),
    },
    status_change_timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_last_transaction_payment_id: {
      type: Sequelize.STRING,
    },
    evse_last_transaction_timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_last_transaction_amount: {
      type: Sequelize.STRING,
    },
    evse_charging_last_time_stamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_current: {
      type: Sequelize.STRING,
    },
    evse_last_current_timestamp: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    evse_energy: {
      type: Sequelize.STRING,
    },
    evse_connected_to_interface: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    evse_location: {
      type: Sequelize.STRING,
    },
    evse_max_current: {
      type: Sequelize.STRING,
    },
    evse_payment_state: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    evse_app_ascreen: {
      type: Sequelize.STRING,
    },
    evse_status_code_raw: {
      type: Sequelize.STRING,
    },
    evse_status_code: {
      type: Sequelize.STRING,
    },
    remote_log: {
      type: Sequelize.STRING,
    },
    evse_temerature: {
      type: Sequelize.STRING,
    },
    evse_throttled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    evse_voltage: {
      type: Sequelize.STRING,
    },
    evse_quickpay_enabled: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    evse_status_code_command: {
      type: Sequelize.STRING,
    },
    evse_energy_usage: {
      type: Sequelize.INTEGER,
    },
  },
  {
    tableName: "ev_charger_timestamps",
    paranoid: true,
    timestamps: true,
  }
);

export default EVChargerTimestamp;
