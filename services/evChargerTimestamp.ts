import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { EVChargerTimestampsAttributes } from "../types/evChargerTimestamp";

const getAllEVChargerTimestamps = async (params: { [key: string]: any }) => {
  const { EVChargerTimestamp } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        serial_no: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let evChargerTimestamps = await EVChargerTimestamp.findAndCountAll({
    where,
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
    ],
    raw: true,
  });

  return { data: evChargerTimestamps?.rows, count: evChargerTimestamps?.count };
};

/* Create new ev charger timestamp*/
const createEVChargerTimestamp = async (
  timestampObj: Partial<EVChargerTimestampsAttributes>,
  transaction: Transaction
) => {
  const { EVChargerTimestamp } = Models;
  let evChargerTimestampCreated = await EVChargerTimestamp.create(
    timestampObj,
    transaction
  );
  if (evChargerTimestampCreated) {
    evChargerTimestampCreated = evChargerTimestampCreated?.toJSON();
    return evChargerTimestampCreated;
  } else {
    return null;
  }
};

const editEVChargerTimestamp = async (
  timestampObj: EVChargerTimestampsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { EVChargerTimestamp } = Models;
  let evChargerTimestamp = await EVChargerTimestamp.findOne({
    where: {
      ev_charger_timestamp_id: id,
    },
    raw: true,
    transaction,
  });
  if (evChargerTimestamp) {
    let evChargerTimestampUpdated = await EVChargerTimestamp.update(
      timestampObj,
      {
        where: { ev_charger_timestamp_id: id },
        transaction,
      }
    ).then(async () => {
      return await EVChargerTimestamp.findOne({
        where: { ev_charger_timestamp_id: id },
        transaction,
        rae: true,
      });
    });
    return evChargerTimestampUpdated;
  } else {
    return null;
  }
};

/* get ev charger timestamp by id */
const getEVChargerTimestamp = async (id: string, transaction: Transaction) => {
  const { EVChargerTimestamp } = Models;
  const evChargerTimestamp = await EVChargerTimestamp.findOne({
    where: {
      ev_charger_timestamp_id: id,
    },
    raw: true,
    transaction,
  });

  return evChargerTimestamp || null;
};

/* Soft delete ev charger timestamp */
const deleteEVChargerTimestamp = async (id: string) => {
  const { EVChargerTimestamp } = Models;
  const evChargerTimestampDeleted = await EVChargerTimestamp.destroy({
    where: {
      ev_charger_timestamp_id: id,
    },
    individualHooks: true,
  });
  return evChargerTimestampDeleted;
};

const lastEVChargerTimestamp = async (
  serial_no: number,
  transaction: Transaction
) => {
  const { EVChargerTimestamp } = Models;
  const evChargerTimestamp = await EVChargerTimestamp.findOne({
    where: {
      serial_no,
    },
    order: [["createdAt", "DESC"]],
    limit: 1,
    raw: true,
    transaction,
  });

  return evChargerTimestamp;
};

const getAllEVChargerTimestampsByTransactionId = async (
  transactionTimestampId: number,
  serial_no: number
) => {
  const { EVChargerTimestamp } = Models;
  const evChargerTimestamps = await EVChargerTimestamp.findAll({
    where: {
      transaction_timestamps_id: transactionTimestampId,
      serial_no
    },
    order: [["createdAt", "DESC"]],
    raw: true,
  });

  return evChargerTimestamps;
};

export default {
  getAllEVChargerTimestamps,
  createEVChargerTimestamp,
  editEVChargerTimestamp,
  getEVChargerTimestamp,
  deleteEVChargerTimestamp,
  lastEVChargerTimestamp,
  getAllEVChargerTimestampsByTransactionId,
};
