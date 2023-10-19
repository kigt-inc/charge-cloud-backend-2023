import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { MerchantsAttributes } from "../types/merchant";
import CONSTANTS from "../utils/constants";

const getAllMerchants = async (params: { [key: string]: any }) => {
  const { Merchant, User } = Models;
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
    include: [
      {
        model: User,
        attributes: ["user_id", "first_name", "last_name"],
        as: "users",
      },
    ],
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
    ],
    distinct: true,
  });

  return { data: merchants?.rows, count: merchants?.count };
};

/* Create new merchant*/
const createMerchant = async (
  merchantObj: MerchantsAttributes,
  t: Transaction
) => {
  const { Merchant } = Models;
  let merchantCreated = await Merchant.create(merchantObj, { transaction: t });
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
        raw: true,
      });
    });
    return merchantUpdated;
  } else {
    return null;
  }
};

/* get merchant by id */
const getMerchant = async (id: string) => {
  const { Merchant, User } = Models;
  const merchant = await Merchant.findOne({
    where: {
      merchant_id: id,
    },
    include: [
      {
        model: User,
        attributes: ["user_id", "first_name", "last_name"],
        as: "users",
      },
    ],
  });

  return merchant || null;
};

/* Soft delete merchant */
const deleteMerchant = async (id: string, t: Transaction) => {
  const { Merchant } = Models;
  const merchantDeleted = await Merchant.destroy(
    {
      where: {
        merchant_id: id,
      },
      individualHooks: true,
    },
    { transaction: t }
  );
  return merchantDeleted;
};

/*merchant validation */
const merchantValidation = async (params: Partial<MerchantsAttributes>) => {
  let validationResponse;
  if (params.merchant_name === "" || params.merchant_name === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} merchantName ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else {
    validationResponse = {
      isValid: true,
    };
  }

  return validationResponse;
};

export default {
  getAllMerchants,
  createMerchant,
  editMerchant,
  getMerchant,
  deleteMerchant,
  merchantValidation,
};
