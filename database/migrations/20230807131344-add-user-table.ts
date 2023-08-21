import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.createTable(
        "users",
        {
          user_id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
          },
          client_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: "clients",
              key: "client_id",
            },
          },
          user_status: {
            type: Sequelize.STRING(9),
            allowNull: false,
            defaultValue: "active",
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          first_name: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "first name is a mandatory field",
              },
            },
          },
          last_name: {
            type: Sequelize.STRING(25),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "last name is a mandatory field",
              },
            },
          },
          email: {
            type: Sequelize.STRING(50),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "email is a mandatory field",
              },
            },
          },
          phone_no: {
            type: Sequelize.STRING(15),
            allowNull: false,
            validate: {
              notEmpty: {
                msg: "phone number is a mandatory field",
              },
            },
          },
          type: {
            type: Sequelize.STRING(8),
            allowNull: true,
          },
          reset_link_token: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          exp_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          online_access: {
            type: Sequelize.STRING(1),
            allowNull: false,
          },
          cust_admin: {
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

      await queryInterface.addConstraint("users", {
        fields: ["email", "deleted_timestamp"],
        type: "unique",
        name: "email",
        transaction,
      });

      await queryInterface.addConstraint("users", {
        fields: ["phone_no", "deleted_timestamp"],
        type: "unique",
        name: "phone_no",
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
      await queryInterface.removeConstraint("users", "email", { transaction });
      await queryInterface.removeConstraint("users", "phone_no", { transaction });
      await queryInterface.dropTable("users", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
