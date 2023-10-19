import _ from "lodash";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import zendeskServices from "../services/zendesk";
import sequelize from "../utils/db-connection";

/* For Create the zendesk ticket */
const createZendeskTicket: RequestHandler = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const ticketObj = req.body;

    let checkZendeskTicketValidation =
      zendeskServices.zendeskTicketValidation(ticketObj);

    if (checkZendeskTicketValidation && !checkZendeskTicketValidation.isValid) {
      await t.rollback();
      res.status(400).json(checkZendeskTicketValidation.message);
    } else {
      const addZendeskTicket = await zendeskServices.createZendeskTicket(
        ticketObj,
        req?.id,
        t
      );
      await t.commit();
      res.status(201).json({
        isSuccess: true,
        data: addZendeskTicket!.data,
        message: CONSTANTS.TICKET_CREATED,
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

const getZendeskTicketsByUser: RequestHandler = async (req, res, next) => {
  try {
    const ticketData = await zendeskServices.getZendeskTicketsByUser(req?.id);

    if (ticketData) {
      res.status(200).send({
        isSuccess: true,
        data: _.omit(ticketData.data, ["next_page", "previous_page"]),
        message: CONSTANTS.DATA_FETCHED,
      });
    } else {
      res.status(404).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NOT_FOUND,
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

export default {
  createZendeskTicket,
  getZendeskTicketsByUser,
};
