import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { ClientsAttributes } from "../types/client";

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
  const { Client } = Models;
  const client = await Client.findOne({
    where: {
      client_id: id,
    },
    raw: true,
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

export default {
  getAllClients,
  createClient,
  editClient,
  getClient,
  deleteClient,
};
