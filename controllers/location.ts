import _ from "lodash";
import locationServices from "../services/location";
import CONSTANTS from "../utils/constants";
import { omitBeforeAddEdit } from "../utils/helpers";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";

/* Create new location */
const createLocation: RequestHandler = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let createObj = req.body;
    createObj = omitBeforeAddEdit(createObj);
    // createObj.createdBy = req?.id;
    let checkLocationValidation = await locationServices.locationValidation(
      createObj
    );
    if (checkLocationValidation && !checkLocationValidation.isValid) {
      await t.rollback();
      res.status(400).json(checkLocationValidation.message);
    } else {
      let addLocation = await locationServices.createLocation(createObj,t);
      await t.commit();
      res.status(201).json({
        isSuccess: true,
        data: addLocation,
        message: CONSTANTS.LOCATION_CREATED,
      });
    }
    next();
  } catch (error: any) {
    await t.rollback();
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

const listLocations: RequestHandler = async (req, res, next) => {
  try {
    const params = req.query;
    const { data, count } = await locationServices.getAllLocations(params,req.role,req.id);
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

const editLocation: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const locationId = req.params.id;
    if (!locationId) {
      await transaction.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let updateObj = req.body;
    updateObj = omitBeforeAddEdit(updateObj);

    let checkLocationValidation = await locationServices.locationValidation(
      updateObj
    );
    if (checkLocationValidation && !checkLocationValidation.isValid) {
      await transaction.rollback();
      res.status(400).json(checkLocationValidation.message);
    } else {
      let updatedLocation = await locationServices.editLocation(
        updateObj,
        locationId,
        transaction
      );

      if (!updatedLocation) {
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
        data: updatedLocation,
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

const getLocation: RequestHandler = async (req, res, next) => {
  try {
    const locationId = req.params.id;
    if (!locationId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    const location = await locationServices.getLocation(locationId);
    if (!location) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
      });
    } else {
      return res.status(200).json({
        isSuccess: true,
        data: location,
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

/* Soft delete site owner*/
const deleteLocation: RequestHandler = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const locationId = req.params.id;
    if (!locationId) {
      await t.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let locationDeleted = await locationServices.deleteLocation(locationId,t);
    if (locationDeleted) {
      await t.commit();
      return res.status(200).json({
        isSuccess: true,
        data: {},
        message: CONSTANTS.LOCATION_DELETED,
      });
    } else {
      await t.rollback();
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
      });
    }
  } catch (error) {
    await t.rollback();
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

export default {
  createLocation,
  editLocation,
  listLocations,
  getLocation,
  deleteLocation,
};
