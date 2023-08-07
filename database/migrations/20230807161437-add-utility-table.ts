import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "utilities",
        {
          utility_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          utility_name: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "utility name is a mandatory field",
              },
            },
          },
          utility_dept: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "utility dept is a mandatory field",
              },
            },
          },
          utility_website: {
            type: Sequelize.STRING(100),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "utility website is a mandatory field",
              },
            },
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
      await queryInterface.dropTable("utilities", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
