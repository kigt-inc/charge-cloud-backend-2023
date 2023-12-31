import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "clients",
        {
          client_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          client_type: {
            type: Sequelize.STRING(15),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "client type is a mandatory field",
              },
            },
          },
          client_name: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "client name is a mandatory field",
              },
            },
          },
          client_addr1: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "client address is a mandatory field",
              },
            },
          },
          client_addr2: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "client address is a mandatory field",
              },
            },
          },
          state_province: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "state province is a mandatory field",
              },
            },
          },
          city: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "city is a mandatory field",
              },
            },
          },
          country: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "country is a mandatory field",
              },
            },
          },
          zip: {
            type: Sequelize.STRING(20),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "zip is a mandatory field",
              },
            },
          },
          reporting_freq: {
            type: Sequelize.STRING(10),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "reporting frequency is a mandatory field",
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
    try {
      await queryInterface.dropTable("clients", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
