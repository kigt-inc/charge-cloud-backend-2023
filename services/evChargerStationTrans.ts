import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { EVChargeStationTransAttributes } from "../types/evChargeStationTrans";

const getAllEVChargeStationTrans = async (params: { [key: string]: any }) => {
  const { EVChargeStationTrans } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        charge_record_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let evChargeStationTrans = await EVChargeStationTrans.findAndCountAll({
    where,
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
      ["charge_record_id", "DESC"],
    ],
    raw: true,
  });

  return {
    data: evChargeStationTrans?.rows,
    count: evChargeStationTrans?.count,
  };
};

/* Create new EVChargeStationTrans*/
const createEVChargeStationTrans = async (
  evChargerStationTransObj: Partial<EVChargeStationTransAttributes>,
  t: Transaction
) => {
  const { EVChargeStationTrans } = Models;
  let evChargerStationTransCreated = await EVChargeStationTrans.create(
    evChargerStationTransObj,
    { transaction: t }
  );
  if (evChargerStationTransCreated) {
    evChargerStationTransCreated = evChargerStationTransCreated?.toJSON();
    return evChargerStationTransCreated;
  } else {
    return null;
  }
};

const editEVChargeStationTrans = async (
  evChargerStationTransObj: Partial<EVChargeStationTransAttributes>,
  id: string,
  transaction: Transaction
) => {
  const { EVChargeStationTrans } = Models;
  let evChargerStationTrans = await EVChargeStationTrans.findOne({
    where: {
      charge_record_id: id,
    },
    raw: true,
    transaction,
  });
  if (evChargerStationTrans) {
    let evChargerStationTransUpdated = await EVChargeStationTrans.update(
      evChargerStationTransObj,
      {
        where: { charge_record_id: id },
        transaction,
      }
    ).then(async () => {
      return await EVChargeStationTrans.findOne({
        where: { charge_record_id: id },
        transaction,
        raw: true,
      });
    });
    return evChargerStationTransUpdated;
  } else {
    return null;
  }
};

/* get EVChargeStationTrans by id */
const getEVChargeStationTrans = async (id: string) => {
  const { EVChargeStationTrans } = Models;
  const evChargerStationTrans = await EVChargeStationTrans.findOne({
    where: {
      charge_record_id: id,
    },
    raw: true,
  });

  return evChargerStationTrans || null;
};

/* get EVChargeStationTrans by id */
const getAllEVChargeStationTransByTransactionTimestampId = async (
  id: number
) => {
  const { EVChargeStationTrans } = Models;
  const evChargerStationTrans = await EVChargeStationTrans.findAll({
    where: {
      transaction_timestamp_id: id,
    },
    order: [
      ["createdAt", "DESC"],
      ["charge_record_id", "DESC"],
    ],
    raw: true,
  });

  return evChargerStationTrans || null;
};

/* Soft delete EVChargeStationTrans */
const deleteEVChargeStationTrans = async (id: string, t: Transaction) => {
  const { EVChargeStationTrans } = Models;
  const evChargerStationTransDeleted = await EVChargeStationTrans.destroy(
    {
      where: {
        charge_record_id: id,
      },
      individualHooks: true,
    },
    { transaction: t }
  );
  return evChargerStationTransDeleted;
};

export default {
  getAllEVChargeStationTrans,
  createEVChargeStationTrans,
  editEVChargeStationTrans,
  getEVChargeStationTrans,
  deleteEVChargeStationTrans,
  getAllEVChargeStationTransByTransactionTimestampId,
};
