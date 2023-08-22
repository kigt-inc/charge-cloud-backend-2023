import _ from "lodash";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import zendeskServices from "../services/zendesk";

/* For Create the zendesk ticket */
const createZendeskTicket: RequestHandler = async (req, res, next) => {
  try {
    const ticketObj = req.body;

    let checkZendeskTicketValidation =
      await zendeskServices.zendeskTicketValidation(ticketObj);

    if (checkZendeskTicketValidation && !checkZendeskTicketValidation.isValid) {
      res.status(400).json(checkZendeskTicketValidation.message);
    } else {
      const addZendeskTicket = await zendeskServices.createZendeskTicket(
        ticketObj,
        req?.id
      );
      res.status(201).json({
        isSuccess: true,
        data: addZendeskTicket!.data,
        message: CONSTANTS.TICKET_CREATED,
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
