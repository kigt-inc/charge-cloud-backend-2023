import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
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
            allowNull: false,
            references: {
              model: "customers",
              key: "customer_id",
            },
          },
          charge_station_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "charge_stations",
              key: "charge_station_id",
            },
          },
          certificate_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "certificates",
              key: "certificate_id",
            },
          },
          id_evse: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          transaction_status: {
            type: Sequelize.STRING(15),
            allowNull: false,
          },
          transaction_stop_reason: {
            type: Sequelize.STRING(20),
            allowNull: false,
          },
          connector_status: {
            type: Sequelize.STRING(12),
            allowNull: false,
          },
          event_record_type: {
            type: Sequelize.STRING(2),
            allowNull: false,
          },
          event_start: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          event_end: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          event_duration: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          qr_count: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          purchase_product_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          purchase_produce_name: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          customer_throttle: {
            type: Sequelize.STRING(1),
            allowNull: false,
          },
          customer_throttle_number: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          customer_throttle_acceptance_time: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          customer_throttle_time: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          meter_start: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          meter_end: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          kwh_session: {
            type: Sequelize.FLOAT,
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
          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          deletedAt: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // If migration fails, this will be called. Rollback your migration changes.
    try {
      await queryInterface.dropTable("ev_charge_station_trans", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
