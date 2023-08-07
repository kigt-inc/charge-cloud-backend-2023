import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "fixed_price_rate_schedules",
        {
          fixed_price_rate_schedules_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          fixed_price_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "fixed_prices",
              key: "fixed_price_id",
            },
          },
          start_time: {
            type: Sequelize.TIME,
            allowNull: false,
          },
          end_time: {
            type: Sequelize.TIME,
            allowNull: false,
          },
          rate: {
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
          rate_schedule_type: {
            type: Sequelize.STRING(1),
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
      await queryInterface.dropTable("fixed_price_rate_schedules", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
