import _ from "lodash";
import axios from "axios";
import { zendeskTicketAttributes } from "../types/zendesk";
import CONSTANTS from "../utils/constants";
import { validateEmail } from "../utils/helpers";
import Models from "../database/models";

const createZendeskTicket = async (
  params: zendeskTicketAttributes,
  userId: number
) => {
  const { UserTicket } = Models;
  const ticketData = JSON.stringify({
    ticket: {
      comment: {
        body: params.body,
      },
      priority: params.priority,
      subject: params.subject,
      requester: {
        name: params.name,
        email: params.email,
      },
    },
  });

  const passwordString = `${process.env.ZENDESK_USERNAME}:${process.env.ZENDESK_API_TOKEN}`;
  const base64PasswordString = btoa(passwordString);

  const config = {
    method: "POST",
    url: `${process.env.ZENDESK_REMOTE_URL}/tickets`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${base64PasswordString}`, // Base64 encoded "username:password"
    },
    data: ticketData,
  };

  let response = await axios(config);

  const userTicketObj = {
    user_id: userId,
    ticket_id: response?.data && response?.data?.ticket?.id,
  };
  let userTicketCreated = await UserTicket.create(userTicketObj);

  if (response && userTicketCreated) {
    return response;
  } else {
    return null;
  }
};

const getZendeskTicketsByUser = async (userId: number) => {
  const { UserTicket } = Models;
  let response;
  const passwordString = `${process.env.ZENDESK_USERNAME}:${process.env.ZENDESK_API_TOKEN}`;
  const base64PasswordString = btoa(passwordString);

  let ids = await UserTicket.findAll({
    where: {
      user_id: userId,
    },
    attributes: ["ticket_id"],
    raw: true,
  });

  if (ids.length > 1) {
    ids = ids
      ?.reduce(
        (accValue: number[], id: { ticket_id: number }) => [
          ...accValue,
          id.ticket_id,
        ],
        []
      )
      .join(",");

    const config = {
      method: "GET",
      url: `${process.env.ZENDESK_REMOTE_URL}/tickets/show_many?ids=${ids}`,
      params: {
        query: `requester:darshan.p@crestinfosystems.com`,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${base64PasswordString}`, // Base64 encoded "username:password"
      },
    };

    response = await axios(config);
    return response;
  } else {
    response = null;
  }
};

/* validate request for sign in */
const zendeskTicketValidation = (params: zendeskTicketAttributes) => {
  let validationResponse;

  if (params.name === "" || params.name === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `name ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.subject === "" || params.subject === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `subject ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.body === "" || params.body === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `body ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.priority === "" || params.priority === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `priority ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else {
    let emailData = validateEmail(params.email);

    if (emailData) {
      validationResponse = {
        isValid: true,
      };
    } else {
      validationResponse = {
        isValid: false,
        message: {
          isSuccess: false,
          data: [],
          message: `${CONSTANTS.PLEASE_PROVIDE_VALID} email ID`,
        },
      };
    }
  }

  return validationResponse;
};

export default {
  createZendeskTicket,
  zendeskTicketValidation,
  getZendeskTicketsByUser,
};
