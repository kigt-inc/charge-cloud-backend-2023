import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { LocationsAttributes } from "../types/location";
import CONSTANTS from "../utils/constants";
import userServices from "./user";

const getAllLocations = async (
  params: { [key: string]: any },
  role: string,
  userId: number
) => {
  const { Location, ChargeStation } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        location_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  let where: { [key: string]: any } = {
    ...searchObj,
  };

  if (role === CONSTANTS.ROLES.CLIENT) {
    const user = await userServices.getUser(userId);
    if (user.client_id) {
      where = {
        ...where,
        client_id: user.client_id,
      };
    } else {
      return { data: [], count: 0 };
    }
  }

  const locations = await Location.findAndCountAll({
    where,
    include: [
      {
        model: ChargeStation,
        as: "chargeStations",
      },
    ],
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
    ],
    distinct: true,
  });

  return { data: locations?.rows, count: locations?.count };
};

/* Create new location*/
const createLocation = async (
  locationObj: LocationsAttributes,
  t: Transaction
) => {
  const { Location } = Models;
  let locationCreated = await Location.create(locationObj, { transaction: t });
  if (locationCreated) {
    locationCreated = locationCreated?.toJSON();
    return locationCreated;
  } else {
    return null;
  }
};

const editLocation = async (
  locationObj: LocationsAttributes,
  id: string,
  transaction: Transaction
) => {
  const { Location } = Models;
  let location = await Location.findOne({
    where: {
      location_id: id,
    },
    raw: true,
    transaction,
  });
  if (location) {
    let locationUpdated = await Location.update(locationObj, {
      where: { location_id: id },
      transaction,
    }).then(async () => {
      return await Location.findOne({
        where: { location_id: id },
        transaction,
        raw: true,
      });
    });
    return locationUpdated;
  } else {
    return null;
  }
};

/* get location by id */
const getLocation = async (id: string) => {
  const { Location, ChargeStation } = Models;
  const location = await Location.findOne({
    where: {
      location_id: id,
    },
    include: [
      {
        model: ChargeStation,
        as: "chargeStations",
      },
    ],
  });

  return location || null;
};

/* Soft delete location */
const deleteLocation = async (id: string, t: Transaction) => {
  const { Location } = Models;
  const locationDeleted = await Location.destroy(
    {
      where: {
        location_id: id,
      },
      individualHooks: true,
    },
    { transaction: t }
  );
  return locationDeleted;
};

// location validation
const locationValidation = async (locationObj: LocationsAttributes) => {
  let validationResponse;
  if (
    locationObj.location_name === "" ||
    locationObj.location_name === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `locationName ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (
    locationObj.rate_type === "" ||
    locationObj.rate_type === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `rateType ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.addr_l1 === "" || locationObj.addr_l1 === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `addrL1 ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.addr_l2 === "" || locationObj.addr_l2 === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `addrL2 ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.city === "" || locationObj.city === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `city ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.state === "" || locationObj.state === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `state ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.country === "" || locationObj.country === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `country ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (locationObj.loc_zip === "" || locationObj.loc_zip === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `location zipCode ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };
    return validationResponse;
  } else if (
    typeof locationObj?.location_max_reservation !== "number" ||
    locationObj.location_max_reservation === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `location max reservation ${CONSTANTS.IS_MANDATORY_FIELD} and should be number`,
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

export default {
  getAllLocations,
  createLocation,
  editLocation,
  getLocation,
  deleteLocation,
  locationValidation,
};
