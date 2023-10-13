import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { ClientsModel } from "../../types/client";
import Location from "./location";

const Client = sequelize.define<ClientsModel>(
  "clients",
  {
    client_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "user_id",
      },
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
  },
  {
    tableName: "clients",
    paranoid: true,
    timestamps: true,
    hooks: {
      afterDestroy: async function (client, fn) {
        await Location.destroy({
          where: {
            [Sequelize.Op.or]: [{ client_id: client.client_id }],
          },
          individualHooks: true,
          transaction: fn.transaction,
        });
      },
    },
  }
);

export default Client;
