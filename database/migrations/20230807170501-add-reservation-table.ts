import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.createTable(
        "reservations",
        {
          reservation_id: {
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
          location_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "locations",
              key: "location_id",
            },
          },
          charge_station_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "charge_stations",
              key: "charge_station_id",
            },
          },
          reservation_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          reservation_time: {
            type: Sequelize.TIME,
            allowNull: false,
          },
          reservation_date_expiry: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          reservation_time_expiry: {
            type: Sequelize.TIME,
            allowNull: false,
          },
          reservation_status: {
            type: Sequelize.STRING(1),
            allowNull: false,
          },
          reservation_type: {
            type: Sequelize.STRING(1),
            allowNull: false,
          },
          reservation_creation_timestamp: {
            type: Sequelize.DATE,
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
      await queryInterface.dropTable("reservations", { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
