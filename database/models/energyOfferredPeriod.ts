import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { EnergyOfferedPeriodModel } from "../../types/energyOfferedPeriod";

const EnergyOfferedPeriod = sequelize.define<EnergyOfferedPeriodModel>(
  "energy_offered_period",
  {
    energy_offerred_period_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    charge_record_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "ev_charge_station_trans",
        key: "charge_record_id",
      },
    },
    energy_offerred_period_type: {
      type: Sequelize.STRING(9),
      allowNull: false,
    },
    energy_offerred_start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    energy_offerred_end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "energy_offered_period",
    paranoid: true,
    timestamps: true,
  }
);

export default EnergyOfferedPeriod;
