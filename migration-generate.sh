#!/bin/bash

file_name=$(date +"%Y%m%d%H%M%S")-$1.ts
file_path=./database/migrations/$file_name

cat > $file_path << EOF
import Sequelize,{ QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
  const transaction = await queryInterface.sequelize.transaction();
    // Write migration code here.
    try{
      await transaction.commit()
    }catch(error){
      await transaction.rollback()
      throw error;
    }
  },
  down: async (queryInterface: QueryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();
    // If migration fails, this will be called. Rollback your migration changes.
    try{
      await transaction.commit()
    }catch(error){
      await transaction.rollback()
      throw error;
    }
  },
};
EOF

echo "Created migration file: $file_name"