import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { DemandResponseEventsModel } from "../../types/demandResponseEvents";

const DemandResponseEvents = sequelize.define<DemandResponseEventsModel>(
  "demand_response_events",
  {
    demand_response_event_id: {
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
    event_start: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    event_end: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "demand_response_events",
    paranoid: true,
    timestamps: true,
  }
);

export default DemandResponseEvents;
