import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { ClientsAttributes } from "../types/client";
import CONSTANTS from "../utils/constants";

const getAllClients = async (params: { [key: string]: any }) => {
  const { Client } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        client_name: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let clients = await Client.findAndCountAll({
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

  return { data: clients?.rows, count: clients?.count };
};

/* Create new Client*/
const createClient = async (clientObj: ClientsAttributes) => {
  const { Client } = Models;
  let clientCreated = await Client.create(clientObj);
  if (clientCreated) {
    clientCreated = clientCreated?.toJSON();
    return clientCreated;
  } else {
    return null;
  }
};

const editClient = async (
  clientObj: ClientsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { Client } = Models;
  let client = await Client.findOne({
    where: {
      client_id: id,
    },
    raw: true,
    transaction,
  });
  if (client) {
    let clientUpdated = await Client.update(clientObj, {
      where: { client_id: id },
      transaction,
    }).then(async () => {
      return await Client.findOne({
        where: { client_id: id },
        transaction,
        raw: true,
      });
    });
    return clientUpdated;
  } else {
    return null;
  }
};

/* get Client by id */
const getClient = async (id: number) => {
  const { Client, User } = Models;
  const client = await Client.findOne({
    where: {
      client_id: id,
    },
    include: [
      {
        model: User,
        attributes: ["user_id", "first_name", "last_name", "email", "phone_no"],
        as: "user",
      },
    ],
  });

  return client || null;
};

/* Soft delete Client */
const deleteClient = async (id: string) => {
  const { Client } = Models;
  const clientDeleted = await Client.destroy({
    where: {
      client_id: id,
    },
    individualHooks: true,
  });
  return clientDeleted;
};

/* Client validation */
const clientValidation = async (params: Partial<ClientsAttributes>) => {
  let validationResponse;
  if (params.client_type === "" || params.client_type === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} clientType ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.client_name === "" || params.client_name === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} clientName ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.client_addr1 === "" || params.client_addr1 === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} clientAddr1 ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.client_addr2 === "" || params.client_addr2 === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} clientAddr2 ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (
    params.state_province === "" ||
    params.state_province === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} stateProvince ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.city === "" || params.city === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} city ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.country === "" || params.country === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} country ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.zip === "" || params.zip === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} zip ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (
    params.reporting_freq === "" ||
    params.reporting_freq === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} reportingFreq ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (
    typeof params.user_id !== "number" ||
    params.user_id === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} userId ${CONSTANTS.IS_MANDATORY_FIELD}`,
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

const getClientByUserId = async (userId: number) => {
  const { Client } = Models;
  const client = await Client.findOne({
    where: {
      user_id: userId,
    },
    raw: true,
  });

  return client;
};

export default {
  getAllClients,
  createClient,
  editClient,
  getClient,
  deleteClient,
  clientValidation,
  getClientByUserId,
};
