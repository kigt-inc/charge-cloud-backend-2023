import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "geo_fence_rates",
        {
          geo_fence_rate_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          geo_utility_fence_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "utility_geo_fences",
              key: "geo_utility_fence_id",
            },
          },
          kigt_collected_usag: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          utility_accepted_usage: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          start_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          end_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          geo_fence_state: {
            type: Sequelize.STRING(10),
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
      await queryInterface.dropTable("geo_fence_rates", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
