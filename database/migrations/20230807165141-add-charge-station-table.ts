import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
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
      await queryInterface.dropTable("charge_stations", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
