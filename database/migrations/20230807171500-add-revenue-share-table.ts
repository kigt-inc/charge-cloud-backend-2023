import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "revenue_shares",
        {
          revenue_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          charge_station_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "charge_stations",
              key: "charge_station_id",
            },
          },
          client_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "clients",
              key: "client_id",
            },
          },
          revenue_start: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          revenue_end: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          revenue_amt: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          revenue_type: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          paid_collected: {
            type: Sequelize.STRING(3),
            allowNull: false,
          },
          invoiced: {
            type: Sequelize.STRING(3),
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
      await queryInterface.dropTable("revenue_shares", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
