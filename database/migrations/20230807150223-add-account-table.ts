import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "accounts",
        {
          account_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          customer_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "customers",
              key: "customer_id",
            },
          },
          account_type: {
            type: Sequelize.STRING(1),
            allowNull: false
          },
          payment_details: {
            type: Sequelize.STRING(20),
          },
          charge_duration: {
            type: Sequelize.INTEGER,
            allowNull: false
          },
          throttle_pref: {
            type: Sequelize.STRING(1),
            allowNull: false
          },
          revenue_percent: {
            type: Sequelize.FLOAT,
            allowNull: false
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
      await queryInterface.dropTable("accounts", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
