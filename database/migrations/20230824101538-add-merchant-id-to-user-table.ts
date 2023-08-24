import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.addColumn(
        "users",
        "merchant_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "merchants",
            key: "merchant_id",
          },
        },
        { transaction }
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE users MODIFY COLUMN merchant_id INT AFTER user_id",
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
      await queryInterface.removeColumn("users", "merchant_id", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
