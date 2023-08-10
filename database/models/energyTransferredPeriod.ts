import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { EnergyTransferredPeriodModel } from "../../types/energyTransferredPeriod";

const EnergyTransferredPeriod = sequelize.define<EnergyTransferredPeriodModel>(
  "energy_transferred_period",
  {
    energy_transfer_period_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    energy_offerred_period_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "energy_offered_period",
        key: "energy_offerred_period_id",
      },
    },
    energy_transferred_start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    energy_transferred_end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "energy_transferred_period",
    paranoid: true,
    timestamps: true,
  }
);

export default EnergyTransferredPeriod;
