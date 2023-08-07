#!/bin/bash

file_name=$(date +"%Y%m%d%H%M%S")-$1.ts
file_path=./database/seeders/$file_name

cat > $file_path << EOF
"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: any, Sequelize: any) {},

  async down(queryInterface: any, Sequelize: any) {},
};
EOF

echo "Created seeder file: $file_name"