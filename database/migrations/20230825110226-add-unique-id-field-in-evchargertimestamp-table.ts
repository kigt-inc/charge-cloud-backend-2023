import Sequelize, { QueryInterface } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try {
      await queryInterface.addColumn(
        "ev_charger_timestamps",
        "unique_id",
        {
          type: Sequelize.STRING,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "uniqueId is a mandatory field",
            },
          },
        },
        { transaction }
      );

      await queryInterface.addConstraint("ev_charger_timestamps", {
        fields: ["unique_id"],
        type: "unique",
        name: "unique_id",
        transaction,
      });

      await queryInterface.sequelize.query(
        "ALTER TABLE ev_charger_timestamps MODIFY COLUMN unique_id VARCHAR(255) AFTER serial_no",
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
      await queryInterface.removeConstraint(
        "ev_charger_timestamps",
        "unique_id",
        { transaction }
      );

      await queryInterface.removeColumn("ev_charger_timestamps", "unique_id", {
        transaction,
      });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
