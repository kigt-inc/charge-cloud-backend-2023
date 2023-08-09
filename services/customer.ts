import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { CustomersAttributes } from "../types/customer";

const getAllCustomers = async (params: { [key: string]: any }) => {
  const { Customer } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        customer_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let customers = await Customer.findAndCountAll({
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

  return { data: customers?.rows, count: customers?.count };
};

/* Create new customer*/
const createCustomer = async (customerObj: CustomersAttributes) => {
  const { Customer } = Models;
  let customerCreated = await Customer.create(customerObj);
  if (customerCreated) {
    customerCreated = customerCreated?.toJSON();
    return customerCreated;
  } else {
    return null;
  }
};

const editCustomer = async (
  customerObj: CustomersAttributes,
  id: string,
  transaction: Transaction
) => {
  const { Customer } = Models;
  let customer = await Customer.findOne({
    where: {
      customer_id: id,
    },
    raw: true,
    transaction,
  });
  if (customer) {
    let customerUpdated = await Customer.update(customerObj, {
      where: { customer_id: id },
      transaction,
    }).then(async () => {
      return await Customer.findOne({
        where: { customer_id: id },
        transaction,
        rae: true,
      });
    });
    return customerUpdated;
  } else {
    return null;
  }
};

/* get customer by id */
const getCustomer = async (id: string) => {
  const { Customer } = Models;
  const customer = await Customer.findOne({
    where: {
      customer_id: id,
    },
    raw: true,
  });

  return customer || null;
};

/* Soft delete customer */
const deleteCustomer = async (id: string) => {
  const { Customer } = Models;
  const customerDeleted = await Customer.destroy({
    where: {
      customer_id: id,
    },
    individualHooks: true,
  });
  return customerDeleted;
};

export default {
  getAllCustomers,
  createCustomer,
  editCustomer,
  getCustomer,
  deleteCustomer,
};
