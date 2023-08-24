"use strict";

import Sequelize, { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    // Write seeder code here.
    try {
      const alreadyExists = await queryInterface.rawSelect("roles", {}, [
        "role_id",
      ]);
      if (!alreadyExists) {
        await queryInterface.bulkInsert(
          "roles",
          [
            {
              role_name: "client",
              role_description: "client",
              client_admin: "n",
              createdAt: Sequelize.fn("now"),
              updatedAt: Sequelize.fn("now"),
            },
            {
              role_name: "user",
              role_description: "user",
              client_admin: "n",
              createdAt: Sequelize.fn("now"),
              updatedAt: Sequelize.fn("now"),
            },
            {
              role_name: "superadmin",
              role_description: "superadmin",
              client_admin: "y",
              createdAt: Sequelize.fn("now"),
              updatedAt: Sequelize.fn("now"),
            },
          ],
          { transaction }
        );
      }
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    // If seeder fails, this will be called. Rollback your seeder changes.
    try {
      await queryInterface.bulkDelete("roles", {}, { transaction });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
