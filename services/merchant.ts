import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { MerchantsAttributes } from "../types/merchant";

const getAllMerchants = async (params: { [key: string]: any }) => {
  const { Merchant } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        merchant_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let merchants = await Merchant.findAndCountAll({
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

  return { data: merchants?.rows, count: merchants?.count };
};

/* Create new merchant*/
const createMerchant = async (merchantObj: MerchantsAttributes) => {
  const { Merchant } = Models;
  let merchantCreated = await Merchant.create(merchantObj);
  if (merchantCreated) {
    merchantCreated = merchantCreated?.toJSON();
    return merchantCreated;
  } else {
    return null;
  }
};

const editMerchant = async (
  merchantObj: MerchantsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { Merchant } = Models;
  let merchant = await Merchant.findOne({
    where: {
      merchant_id: id,
    },
    raw: true,
    transaction,
  });
  if (merchant) {
    let merchantUpdated = await Merchant.update(merchantObj, {
      where: { merchant_id: id },
      transaction,
    }).then(async () => {
      return await Merchant.findOne({
        where: { merchant_id: id },
        transaction,
        rae: true,
      });
    });
    return merchantUpdated;
  } else {
    return null;
  }
};

/* get merchant by id */
const getMerchant = async (id: string) => {
  const { Merchant } = Models;
  const merchant = await Merchant.findOne({
    where: {
      merchant_id: id,
    },
    raw: true,
  });

  return merchant || null;
};

/* Soft delete merchant */
const deleteMerchant = async (id: string) => {
  const { Merchant } = Models;
  const merchantDeleted = await Merchant.destroy({
    where: {
      merchant_id: id,
    },
    individualHooks: true,
  });
  return merchantDeleted;
};

export default {
  getAllMerchants,
  createMerchant,
  editMerchant,
  getMerchant,
  deleteMerchant,
};
