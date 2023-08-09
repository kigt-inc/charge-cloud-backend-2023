import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { ChargeStationsAttributes } from "../types/chargeStation";

const getAllChargeStations = async (params: { [key: string]: any }) => {
  const { ChargeStation } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        charge_station_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let chargeStations = await ChargeStation.findAndCountAll({
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

  return { data: chargeStations?.rows, count: chargeStations?.count };
};

/* Create new charge station*/
const createChargeStation = async (
  chargeStationObj: ChargeStationsAttributes
) => {
  const { ChargeStation } = Models;
  let chargeStationCreated = await ChargeStation.create(chargeStationObj);
  if (chargeStationCreated) {
    chargeStationCreated = chargeStationCreated?.toJSON();
    return chargeStationCreated;
  } else {
    return null;
  }
};

const editChargeStation = async (
  chargeStationObj: ChargeStationsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { ChargeStation } = Models;
  let chargeStation = await ChargeStation.findOne({
    where: {
      charge_station_id: id,
    },
    raw: true,
    transaction,
  });
  if (chargeStation) {
    let chargeStationUpdated = await ChargeStation.update(chargeStationObj, {
      where: { charge_station_id: id },
      transaction,
    }).then(async () => {
      return await ChargeStation.findOne({
        where: { charge_station_id: id },
        transaction,
        rae: true,
      });
    });
    return chargeStationUpdated;
  } else {
    return null;
  }
};

/* get charge station by id */
const getChargeStation = async (id: string) => {
  const { ChargeStation } = Models;
  const chargeStation = await ChargeStation.findOne({
    where: {
      charge_station_id: id,
    },
    raw: true,
  });

  return chargeStation || null;
};

/* get charge station by serial no */
const getChargeStationBySerialNo = async (
  serial_no: number,
  transaction: Transaction
) => {
  const { ChargeStation } = Models;
  const chargeStation = await ChargeStation.findOne({
    where: {
      ev_charger_serial_no: serial_no,
    },
    raw: true,
    transaction,
  });

  return chargeStation || null;
};

/* Soft delete charge station */
const deleteChargeStation = async (id: string) => {
  const { ChargeStation } = Models;
  const chargeStationDeleted = await ChargeStation.destroy({
    where: {
      charge_station_id: id,
    },
    individualHooks: true,
  });
  return chargeStationDeleted;
};

export default {
  getAllChargeStations,
  createChargeStation,
  editChargeStation,
  getChargeStation,
  deleteChargeStation,
  getChargeStationBySerialNo,
};
