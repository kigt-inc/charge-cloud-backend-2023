import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "co2_certificate_authority",
        {
          co2_certificate_agency_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          agent_name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "agent name is a mandatory field",
              },
            },
          },
          dept_name: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "dept name is a mandatory field",
              },
            },
          },
          website: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "website is a mandatory field",
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
      await queryInterface.dropTable("co2_certificate_authority", {
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
