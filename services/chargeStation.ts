import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { ChargeStationsAttributes } from "../types/chargeStation";
import CONSTANTS from "../utils/constants";

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
  chargeStationObj: Partial<ChargeStationsAttributes>,
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
        raw: true,
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

// charge station validation
const chargeStationValidation = async (
  chargeStationObj: Partial<ChargeStationsAttributes>
) => {
  type requiredFieldsAttr = keyof Partial<ChargeStationsAttributes>;
  const requiredFields: requiredFieldsAttr[] = [
    "ev_charger_serial_no",
    "site_location_identifier",
    "ev_charger_desc",
    "evse_serial_no",
    "terminal_serial_No",
    "interface_serial_no",
    "kiosk_id",
    "product_type",
    "evse_app_screen",
    "evse_payment_state",
    "evse_quickpay",
    "evse_status_code",
    "evse_throttled",
    "evse_max_current",
    "evse_temperature",
    "evse_current",
    "evse_last_charging_timeStamp",
    "evse_connected_interface",
    "evse_voltage",
    "remote_log",
    "mac_address",
    "occupancy_detector",
    "connector_electrical_type",
    "connector_type",
    "charge_station_status",
    "connector_status",
  ];

  for (const field of requiredFields) {
    const value = chargeStationObj[field];

    if (value === undefined || value === "") {
      return {
        isValid: false,
        message: {
          isSuccess: false,
          data: [],
          message: `${field} ${CONSTANTS.IS_MANDATORY_FIELD}`,
        },
      };
    }

    if (
      (field.startsWith("terminal_") ||
        field.startsWith("interface_") ||
        field === "kiosk_id" ||
        field.endsWith("_current") ||
        field.endsWith("_temperature") ||
        field.endsWith("_voltage") ||
        field === "evse_serial_no" ||
        field === "evse_status_code") &&
      typeof value !== "number"
    ) {
      return {
        isValid: false,
        message: {
          isSuccess: false,
          data: [],
          message: `${field} ${CONSTANTS.IS_MANDATORY_FIELD} and should be number`,
        },
      };
    }
  }

  return { isValid: true };
};

export default {
  getAllChargeStations,
  createChargeStation,
  editChargeStation,
  getChargeStation,
  deleteChargeStation,
  getChargeStationBySerialNo,
  chargeStationValidation,
};
