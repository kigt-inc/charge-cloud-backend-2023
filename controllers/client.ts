import _ from "lodash";
import clientServices from "../services/client";
import CONSTANTS from "../utils/constants";
import { omitBeforeAddEdit } from "../utils/helpers";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";

/* Create new client */
const createClient: RequestHandler = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    let createObj = req.body;
    createObj = omitBeforeAddEdit(createObj);
    // createObj.createdBy = req?.id;
    let checkClientValidation = await clientServices.clientValidation(
      createObj
    );
    if (checkClientValidation && !checkClientValidation.isValid) {
      await t.rollback();
      res.status(400).json(checkClientValidation.message);
    } else {
      const client = await clientServices.getClientByUserId(createObj.user_id);  
      if (client!) {
        await t.rollback();
        return res.status(400).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.ALREADY_ASSIGN_CLIENT,
        });
      }
      let addClient = await clientServices.createClient(createObj, t);
      await t.commit();
      res.status(201).json({
        isSuccess: true,
        data: addClient,
        message: CONSTANTS.CLIENT_CREATED,
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

const listClients: RequestHandler = async (req, res, next) => {
  try {
    const params = req.query;
    const { data, count } = await clientServices.getAllClients(params);
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

const editClient: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const clientId = req.params.id;
    if (!clientId) {
      await transaction.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let updateObj = req.body;
    updateObj = omitBeforeAddEdit(updateObj);

    let checkClientValidation = await clientServices.clientValidation(
      updateObj
    );
    if (checkClientValidation && !checkClientValidation.isValid) {
      await transaction.rollback();
      res.status(400).json(checkClientValidation.message);
    } else {
      let updatedClient = await clientServices.editClient(
        updateObj,
        clientId,
        transaction
      );

      if (!updatedClient) {
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
        data: updatedClient,
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

const getClient: RequestHandler = async (req, res, next) => {
  try {
    const clientId = req.params.id;
    if (!clientId) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    const client = await clientServices.getClient(Number(clientId));
    if (!client) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
      });
    } else {
      return res.status(200).json({
        isSuccess: true,
        data: client,
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

/* Soft delete client*/
const deleteClient: RequestHandler = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const clientId = req.params.id;
    if (!clientId) {
      await t.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let clientDeleted = await clientServices.deleteClient(clientId, t);
    if (clientDeleted) {
      await t.commit();
      return res.status(200).json({
        isSuccess: true,
        data: {},
        message: CONSTANTS.CLIENT_DELETED,
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
  createClient,
  editClient,
  listClients,
  getClient,
  deleteClient,
};
