import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { EVChargerTimestampsAttributes } from "../types/evChargerTimestamp";

const getAllEVChargerTimestamps = async (params: { [key: string]: any }) => {
  const { EVChargerTimestamps } = Models;
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
  let owners = await EVChargerTimestamps.findAndCountAll({
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

  return { data: owners?.rows, count: owners?.count };
};

/* Create new ev charger timestamp*/
const createEVChargerTimestamp = async (
  timestampObj: Partial<EVChargerTimestampsAttributes>,
  transaction: Transaction
) => {
  const { EVChargerTimestamps } = Models;
  let evChargerTimestampCreated = await EVChargerTimestamps.create(
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
  const { EVChargerTimestamps } = Models;
  let evChargerTimestamp = await EVChargerTimestamps.findOne({
    where: {
      ev_charger_timestamp_id: id,
    },
    raw: true,
    transaction,
  });
  if (evChargerTimestamp) {
    let evChargerTimestampUpdated = await EVChargerTimestamps.update(
      timestampObj,
      {
        where: { ev_charger_timestamp_id: id },
        transaction,
      }
    ).then(async () => {
      return await EVChargerTimestamps.findOne({
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
  const { EVChargerTimestamps } = Models;
  const evChargerTimestamp = await EVChargerTimestamps.findOne({
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
  const { EVChargerTimestamps } = Models;
  const evChargerTimestampDeleted = await EVChargerTimestamps.destroy({
    where: {
      ev_charger_timestamp_id: id,
    },
    individualHooks: true,
  });
  return evChargerTimestampDeleted;
};

export default {
  getAllEVChargerTimestamps,
  createEVChargerTimestamp,
  editEVChargerTimestamp,
  getEVChargerTimestamp,
  deleteEVChargerTimestamp,
};
