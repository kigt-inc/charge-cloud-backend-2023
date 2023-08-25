import _ from "lodash";
import Models from "../database/models/index";
import Sequelize, { Op } from "sequelize";
import moment from "moment";
import sequelize from "../utils/db-connection";
import userServices from "../services/user";
import CONSTANTS from "../utils/constants";

const energyUtilizationReport = async (
  params: { [key: string]: any },
  year: number | null,
  role: string,
  userId: number
) => {
  const { EVChargeStationTrans } = Models;

  let attributes, group;
  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("ROUND(SUM(kwh_session), 2)"), "totalKwhSession"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      "createdAt",
      [sequelize.literal("ROUND(SUM(kwh_session), 2)"), "totalKwhSession"],
    ];
    group = ["createdAt"];
  }

  let where: { [key: string]: any } = {
    createdAt: {
      [Op.gte]: params.from
        ? params.from
        : moment().subtract(1, "month").toDate(),
      [Op.lte]: params.to ? params.to : moment().toDate(),
    },
    connector_status: "Available",
    meter_start: {
      [Op.not]: null, 
    },
    meter_end: {
      [Op.not]: null,
    },
  };

  if (role === CONSTANTS.ROLES.CLIENT) {
    const user = await userServices.getUser(userId);
    const chargeStations = user.locations.reduce(
      (
        prevChargeStations: number[],
        { chargeStations }: { chargeStations: { charge_station_id: number }[] }
      ) => [
        ...prevChargeStations,
        ...chargeStations.map(({ charge_station_id }) => charge_station_id),
      ],
      []
    );
    where = {
      ...where,
      charge_station_id: chargeStations,
    };
  }

  const data = await EVChargeStationTrans.findAll({
    where,
    attributes,
    group,
    raw: true,
  });

  const totalKwhSum: number = data.reduce(
    (sum: number, record: any) => sum + record.totalKwhSession,
    0
  );

  return {
    energyUtilizationData: data,
    totalKwhSum: +totalKwhSum.toFixed(2),
  };
};

const generatedRevenueReport = async (
  params: { [key: string]: any },
  role: string,
  userId: number,
  year: number | null
) => {
  let attributes, group;
  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("ROUND(SUM(total_cost), 2)"), "totalCost"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      "createdAt",
      [sequelize.literal("ROUND(SUM(total_cost), 2)"), "totalCost"],
    ];
    group = ["createdAt"];
  }

  let where: { [key: string]: any } = {
    createdAt: {
      [Op.gte]: params.from
        ? params.from
        : moment().subtract(1, "month").toDate(),
      [Op.lte]: params.to ? params.to : moment().toDate(),
    },
    connector_status: "Available",
    meter_start: {
      [Op.not]: null, 
    },
    meter_end: {
      [Op.not]: null,
    },
  };

  if (role === CONSTANTS.ROLES.CLIENT) {
    const user = await userServices.getUser(userId);
    const chargeStations = user.locations.reduce(
      (
        prevChargeStations: number[],
        { chargeStations }: { chargeStations: { charge_station_id: number }[] }
      ) => [
        ...prevChargeStations,
        ...chargeStations.map(({ charge_station_id }) => charge_station_id),
      ],
      []
    );
    where = {
      ...where,
      charge_station_id: chargeStations,
    };
  }

  const { EVChargeStationTrans } = Models;
  const data = await EVChargeStationTrans.findAll({
    where,
    attributes,
    group,
    raw: true,
  });

  const totalCostSum: number = data.reduce(
    (sum: number, record: any) => sum + record.totalCost,
    0
  );

  return {
    generateRevenueData: data,
    totalCostSum: +totalCostSum.toFixed(2),
  };
};

const totalChargesReport = async (
  params: { [key: string]: any },
  year: number | null,
  role: string,
  userId: number
) => {
  const { EVChargeStationTrans } = Models;

  let attributes, group;
  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("COUNT(*)"), "chargeSessionCount"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      "createdAt",
      [sequelize.literal("COUNT(*)"), "chargeSessionCount"],
    ];
    group = ["createdAt"];
  }

  let where: { [key: string]: any } = {
    createdAt: {
      [Op.gte]: params.from
        ? params.from
        : moment().subtract(1, "month").toDate(),
      [Op.lte]: params.to ? params.to : moment().toDate(),
    },
    connector_status: "Available",
    meter_start: {
      [Op.not]: null,
    },
    meter_end: {
      [Op.not]: null,
    },
  };
  
  console.log(role,"role");
  
  if (role === CONSTANTS.ROLES.CLIENT) {
    const user = await userServices.getUser(userId);   
    let chargeStations: number[];
    console.log(user.locations,"user.locations");
    
    if(user.locations.length > 0) {
      chargeStations = user.locations.reduce(
        (
          prevChargeStations: number[],
          {
            chargeStations,
          }: { chargeStations: { charge_station_id: number }[] }
        ) => [
          ...prevChargeStations,
          ...chargeStations.map(({ charge_station_id }) => charge_station_id),
        ],
        []
      );
      where = {
        ...where,
        charge_station_id: chargeStations,
      };
    }
  }
  console.log(where,"where");
  
  const data = await EVChargeStationTrans.findAll({
    where,
    attributes,
    group,
    raw: true,
  });
  console.log(data,"data");
  
  const totalChargeSessionCount: number = data.reduce(
    (sum: number, record: any) => sum + record.chargeSessionCount,
    0
  );

  return {
    totalChargeSessionData: data,
    totalChargeSessionsCount: +totalChargeSessionCount.toFixed(2),
  };
};

export default {
  energyUtilizationReport,
  generatedRevenueReport,
  totalChargesReport,
};
