import { ConnectionLogsModel } from "../../types/connectionLog";
import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";

const ConnectionLog = sequelize.define<ConnectionLogsModel>(
  "connections_logs ",
  {
    connection_log_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: Sequelize.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "message is a mandatory field",
        },
      },
    },
  },
  {
    tableName: "connections_logs",
    paranoid: true,
    timestamps: true,
  }
);

export default ConnectionLog;
