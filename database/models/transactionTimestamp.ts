import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { TransactionTimestampsModel } from "../../types/transactionTimestamp";

const TransactionTimestamp = sequelize.define<TransactionTimestampsModel>(
  "transaction_timestamps",
  {
    transaction_timestamp_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    tableName: "transaction_timestamps",
    paranoid: true,
    timestamps: true,
  }
);

export default TransactionTimestamp;
