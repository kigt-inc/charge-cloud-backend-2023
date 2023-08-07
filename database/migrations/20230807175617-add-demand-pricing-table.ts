import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "demand_pricing",
        {
          demand_Price_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          demand_response_event_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "demand_response_events",
              key: "demand_response_event_id",
            },
          },
          geo_fence_rate_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "geo_fence_rates",
              key: "geo_fence_rate_id",
            },
          },
          demand_power_required: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          demand_resonse_rate: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          kigt_electric_usage: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          kigt_electric_reduction: {
            type: Sequelize.FLOAT,
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
      await queryInterface.dropTable("demand_pricing", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
