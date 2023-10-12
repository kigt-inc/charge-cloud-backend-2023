import _ from "lodash";
import Models from "../database/models/index";
import { ConnectionLogsAttributes } from "../types/connectionLog";

/* Create new createConnectionLog*/
const createConnectionLog = async (
  connectionLogObj: Partial<ConnectionLogsAttributes>
) => {
  const { ConnectionLog } = Models;
  let connectionLogCreated = await ConnectionLog.create(connectionLogObj);
  if (connectionLogCreated) {
    connectionLogCreated = connectionLogCreated?.toJSON();
    return connectionLogCreated;
  } else {
    return null;
  }
};

export default {
  createConnectionLog,
};
