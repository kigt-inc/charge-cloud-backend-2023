import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.removeColumn("users", "client_id", { transaction });
      await queryInterface.addColumn(
        "clients",
        "user_id",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "user_id",
          },
        },
        { transaction }
      );
      await queryInterface.sequelize.query(
        "ALTER TABLE clients MODIFY COLUMN user_id INT AFTER client_id",
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
      await queryInterface.addColumn(
        "users",
        "client_id",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "clients",
            key: "client_id",
          },
        },
        { transaction }
      );
      await queryInterface.removeColumn("clients", "user_id", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
