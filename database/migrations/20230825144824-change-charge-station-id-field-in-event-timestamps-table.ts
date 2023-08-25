import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.changeColumn(
        "event_timestamps",
        "charge_station_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "charge_stations",
            key: "charge_station_id",
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
      await queryInterface.changeColumn(
        "event_timestamps",
        "charge_station_id",
        {
          type: Sequelize.INTEGER,
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
