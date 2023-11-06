import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "status_change_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_last_transaction_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_charging_last_time_stamp",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_last_current_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: true,
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
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "status_change_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_last_transaction_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_charging_last_time_stamp",
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );
      await queryInterface.changeColumn(
        "ev_charger_timestamps",
        "evse_last_current_timestamp",
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction }
      );
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
