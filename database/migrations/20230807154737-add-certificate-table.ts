import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "certificates",
        {
          certificate_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          co2_certificate_agency_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "co2_certificate_authority",
              key: "co2_certificate_agency_id",
            },
          },
          kigt_account: {
            type: Sequelize.STRING(25),
            allowNull: false,
          },
          co2_information: {
            type: Sequelize.STRING(20),
            allowNull: false,
          },
          start_period: {
            type: Sequelize.DATE,
          },
          end_period: {
            type: Sequelize.DATE,
          },
          status: {
            type: Sequelize.STRING(15),
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
      await queryInterface.dropTable("certificates", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
