import _ from "lodash";
import merchantServices from "../services/merchant";
import CONSTANTS from "../utils/constants";
import { omitBeforeAddEdit } from "../utils/helpers";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";

/* Create new merchant */
const createMerchant: RequestHandler = async (req, res, next) => {
  try {
    let createObj = req.body;
    createObj = omitBeforeAddEdit(createObj);
    // createObj.createdBy = req?.id;
    let checkMerchantValidation = await merchantServices.merchantValidation(
      createObj
    );
    if (checkMerchantValidation && !checkMerchantValidation.isValid) {
      res.status(400).json(checkMerchantValidation.message);
    } else {
      let addMerchant = await merchantServices.createMerchant(createObj);
      res.status(201).json({
        isSuccess: true,
        data: addMerchant,
        message: CONSTANTS.MERCHANT_CREATED,
      });
    }
    next();
  } catch (error: any) {
    let errorMessage;
    if (error?.name == "SequelizeUniqueConstraintError") {
      errorMessage = error?.errors[0]?.message;
    }
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: errorMessage ? errorMessage : CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

const listMerchants: RequestHandler = async (req, res, next) => {
  try {
    const params = req.query;
    const { data, count } = await merchantServices.getAllMerchants(params);
    return res.status(200).json({
      isSuccess: true,
      data,
      count,
      message: CONSTANTS.DATA_FETCHED,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

const editMerchant: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const merchantId = req.params.id;
    if (!merchantId) {
      await transaction.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let updateObj = req.body;
    updateObj = omitBeforeAddEdit(updateObj);

    let checkMerchantValidation =
      await merchantServices.merchantValidation(updateObj);
    if (checkMerchantValidation && !checkMerchantValidation.isValid) {
      await transaction.rollback();
      res.status(400).json(checkMerchantValidation.message);
    } else {
      let updatedMerchant = await merchantServices.editMerchant(
        updateObj,
        merchantId,
        transaction
      );

      if (!updatedMerchant) {
        await transaction.rollback();
        return res.status(400).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.NOT_FOUND,
        });
      }
      await transaction.commit();
      res.status(201).json({
        isSuccess: true,
        data: updatedMerchant,
        message: CONSTANTS.UPDATED,
      });
    }
    next();
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

const getMerchant: RequestHandler = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    if (!merchantId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    const merchant = await merchantServices.getMerchant(
      merchantId
    );
    if (!merchant) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
      });
    } else {
      return res.status(200).json({
        isSuccess: true,
        data: merchant,
        message: CONSTANTS.DATA_FETCHED,
      });
    }
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

/* Soft delete merchant*/
const deleteMerchant: RequestHandler = async (req, res, next) => {
  try {
    const merchantId = req.params.id;
    if (!merchantId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let merchantDeleted = await merchantServices.deleteMerchant(
      merchantId
    );
    res.status(200).json({
      isSuccess: true,
      data: {},
      message: CONSTANTS.MERCHANT_DELETED,
    });
    next();
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

export default {
  createMerchant,
  getMerchant,
  editMerchant,
  deleteMerchant,
  listMerchants,
};
