import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { TransactionTimestampsAttributes } from "../types/transactionTimestamp";

const getAllTransactionTimestamps = async (params: { [key: string]: any }) => {
  const { TransactionTimestamp } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        transaction_timestamp_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let transactionTimestamps = await TransactionTimestamp.findAndCountAll({
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

  return {
    data: transactionTimestamps?.rows,
    count: transactionTimestamps?.count,
  };
};

/* Create new TransactionTimestamp*/
const createTransactionTimestamp = async () => {
  const { TransactionTimestamp } = Models;
  let transactionTimestampCreated = await TransactionTimestamp.create();
  if (transactionTimestampCreated) {
    transactionTimestampCreated = transactionTimestampCreated?.toJSON();
    return transactionTimestampCreated;
  } else {
    return null;
  }
};

const editTransactionTimestamp = async (
  transactionTimestampObj: TransactionTimestampsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { TransactionTimestamp } = Models;
  let transactionTimestamp = await TransactionTimestamp.findOne({
    where: {
      transaction_timestamp_id: id,
    },
    raw: true,
    transaction,
  });
  if (transactionTimestamp) {
    let transactionTimestampUpdated = await TransactionTimestamp.update(
      transactionTimestampObj,
      {
        where: { transaction_timestamp_id: id },
        transaction,
      }
    ).then(async () => {
      return await TransactionTimestamp.findOne({
        where: { transaction_timestamp_id: id },
        transaction,
        raw: true,
      });
    });
    return transactionTimestampUpdated;
  } else {
    return null;
  }
};

/* get TransactionTimestamp by id */
const getTransactionTimestamp = async (id: string) => {
  const { TransactionTimestamp } = Models;
  const transactionTimestamp = await TransactionTimestamp.findOne({
    where: {
      transaction_timestamp_id: id,
    },
    raw: true,
  });

  return transactionTimestamp || null;
};

/* Soft delete TransactionTimestamp */
const deleteTransactionTimestamp = async (id: string) => {
  const { TransactionTimestamp } = Models;
  const transactionTimestampDeleted = await TransactionTimestamp.destroy({
    where: {
      transaction_timestamp_id: id,
    },
    individualHooks: true,
  });
  return transactionTimestampDeleted;
};

export default {
  getAllTransactionTimestamps,
  createTransactionTimestamp,
  editTransactionTimestamp,
  getTransactionTimestamp,
  deleteTransactionTimestamp,
};
