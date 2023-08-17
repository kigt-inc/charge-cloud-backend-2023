#!/bin/bash

file_name=$(date +"%Y%m%d%H%M%S")-$1.ts
file_path=./database/seeders/$file_name

cat > $file_path << EOF
"use strict";

import { QueryInterface } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    // Write seeder code here.
    try{
      await transaction.commit()
    }catch(error){
      await transaction.rollback()
      throw error;
    }
  },

  async down(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();
    // If seeder fails, this will be called. Rollback your seeder changes.
    try{
      await transaction.commit()
    }catch(error){
      await transaction.rollback()
      throw error;
    }
  },
};
EOF

echo "Created seeder file: $file_name"