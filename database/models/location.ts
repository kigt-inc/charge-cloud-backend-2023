import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { LocationsModel } from "../../types/location";
import ChargeStation from "./chargeStation";

const Location = sequelize.define<LocationsModel>(
  "locations",
  {
    location_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    utility_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "utilities",
        key: "utility_id",
      },
    },
    co2_certificate_agency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "co2_certificate_authority",
        key: "co2_certificate_agency_id",
      },
    },
    location_name: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "location name is a mandatory field",
        },
      },
    },
    rate_type: {
      type: Sequelize.STRING(1),
      allowNull: false,
    },
    client_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "clients",
        key: "client_id",
      },
    },
    addr_l1: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "address is a mandatory field",
        },
      },
    },
    addr_l2: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "address is a mandatory field",
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
    state: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "state is a mandatory field",
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
    loc_zip: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "zip is a mandatory field",
        },
      },
    },
    location_max_reservation: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "locations",
    paranoid: true,
    timestamps: true,
    hooks: {
      afterDestroy: async function (chargeStation, fn) {
        await ChargeStation.destroy({
          where: {
            [Sequelize.Op.or]: [{ location_id: chargeStation.location_id }],
          },
          individualHooks: true,
          transaction: fn.transaction,
        });
      },
    },
  }
);

export default Location;
