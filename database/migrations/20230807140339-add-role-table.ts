import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "roles",
        {
          role_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          role_name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "role name is a mandatory field",
              },
            },
          },
          role_description: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "role description is a mandatory field",
              },
            },
          },
          client_admin: {
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
          deleted_timestamp: {
            type: Sequelize.STRING(100),
            defaultValue: "0",
            allowNull: false,
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint("roles", {
        fields: ["role_name", "deleted_timestamp"],
        type: "unique",
        name: "roleName",
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint("roles", "roleName", {
        transaction,
      });
      await queryInterface.dropTable("roles", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
