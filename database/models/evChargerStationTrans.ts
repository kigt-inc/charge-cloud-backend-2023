import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { EVChargeStationTransModel } from "../../types/evChargeStationTrans";

const EVChargeStationTrans = sequelize.define<EVChargeStationTransModel>(
  "ev_charge_station_trans",
  {
    charge_record_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_timestamp_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "transaction_timestamps",
        key: "transaction_timestamp_id",
      },
    },
    customer_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "customers",
        key: "customer_id",
      },
    },
    charge_station_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "charge_stations",
        key: "charge_station_id",
      },
    },
    certificate_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "certificates",
        key: "certificate_id",
      },
    },
    id_evse: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    transaction_status: {
      type: Sequelize.STRING(15),
      allowNull: true,
    },
    transaction_stop_reason: {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    },
    connector_status: {
      type: Sequelize.STRING(12),
      allowNull: true,
    },
    event_record_type: {
      type: Sequelize.STRING(2),
      allowNull: true,
    },
    event_start: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    event_end: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    event_duration: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    qr_count: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    purchase_product_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    purchase_produce_name: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    customer_throttle: {
      type: Sequelize.STRING(1),
      allowNull: true,
    },
    customer_throttle_number: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    customer_throttle_acceptance_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    customer_throttle_time: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    meter_start: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    meter_end: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    kwh_session: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    event_trigger_reason: {
      type: Sequelize.STRING(20),
    },
    total_cost: {
      type: Sequelize.FLOAT,
    },
    Kigt_charge: {
      type: Sequelize.FLOAT,
    },
    utility_cost: {
      type: Sequelize.FLOAT,
    },
    other_cost: {
      type: Sequelize.FLOAT,
    },
    tariff_cost: {
      type: Sequelize.FLOAT,
    },
    reservation_cost: {
      type: Sequelize.FLOAT,
    },
    offline_indicator: {
      type: Sequelize.STRING(1),
    },
    authorized_indicator: {
      type: Sequelize.STRING(1),
    },
    realtime_db_id_type: {
      type: Sequelize.STRING(1),
    },
  },
  {
    tableName: "ev_charge_station_trans",
    paranoid: true,
    timestamps: true,
  }
);

export default EVChargeStationTrans;
