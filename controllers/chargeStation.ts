import _ from "lodash";
import chargeStationServices from "../services/chargeStation";
import CONSTANTS from "../utils/constants";
import { omitBeforeAddEdit } from "../utils/helpers";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";

/* Create new charge station */
const createChargeStation: RequestHandler = async (req, res, next) => {
  try {
    let createObj = req.body;
    createObj = omitBeforeAddEdit(createObj);
    // createObj.createdBy = req?.id;
    let checkChargeStationValidation =
      await chargeStationServices.chargeStationValidation(createObj);
    if (checkChargeStationValidation && !checkChargeStationValidation.isValid) {
      res.status(400).json(checkChargeStationValidation.message);
    } else {
      let addChargeStation = await chargeStationServices.createChargeStation(
        createObj
      );
      res.status(201).json({
        isSuccess: true,
        data: addChargeStation,
        message: CONSTANTS.CHARGE_STATION_CREATED,
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

const listChargeStations: RequestHandler = async (req, res, next) => {
  try {
    const params = req.query;
    const { data, count } = await chargeStationServices.getAllChargeStations(
      params
    );
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

const editChargeStation: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const chargeStationId = req.params.id;
    if (!chargeStationId) {
      await transaction.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let updateObj = req.body;
    updateObj = omitBeforeAddEdit(updateObj);

    let checkChargeStationValidation =
      await chargeStationServices.chargeStationValidation(updateObj);
    if (checkChargeStationValidation && !checkChargeStationValidation.isValid) {
      transaction.rollback();
      res.status(400).json(checkChargeStationValidation.message);
    } else {
      let updatedChargeStation = await chargeStationServices.editChargeStation(
        updateObj,
        chargeStationId,
        transaction
      );

      if (!updatedChargeStation) {
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
        data: updatedChargeStation,
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

const getChargeStation: RequestHandler = async (req, res, next) => {
  try {
    const chargeStationId = req.params.id;
    if (!chargeStationId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    const chargeStation = await chargeStationServices.getChargeStation(
      chargeStationId
    );
    if (!chargeStation) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
      });
    } else {
      return res.status(200).json({
        isSuccess: true,
        data: chargeStation,
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

/* Soft delete charge station*/
const deleteChargeStation: RequestHandler = async (req, res, next) => {
  try {
    const chargeStationId = req.params.id;
    if (!chargeStationId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let chargeStationDeleted = await chargeStationServices.deleteChargeStation(
      chargeStationId
    );
    res.status(200).json({
      isSuccess: true,
      data: {},
      message: CONSTANTS.CHARGE_STATION_DELETED,
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
  createChargeStation,
  getChargeStation,
  editChargeStation,
  deleteChargeStation,
  listChargeStations,
};
