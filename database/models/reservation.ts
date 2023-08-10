import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { ReservationsModel } from "../../types/reservation";

const Reservations = sequelize.define<ReservationsModel>(
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
  },
  {
    tableName: "reservations",
    paranoid: true,
    timestamps: true,
  }
);

export default Reservations;
