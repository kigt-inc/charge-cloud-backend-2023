import _ from "lodash";
import Models from "../database/models/index";
import Sequelize, { Op } from "sequelize";
import moment from "moment";
import sequelize from "../utils/db-connection";
import userServices from "../services/user";
import CONSTANTS from "../utils/constants";
import excelJS from "exceljs";

const energyUtilizationReport = async (
  params: { [key: string]: any },
  role: string,
  userId: number
) => {
  const { EVChargeStationTrans } = Models;
  let year: number | null = null;
  if (params.from && params.to) {
    params.from = moment(params.from)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ssZ");
    params.to = moment(params.to).endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

    year = moment(params.to).diff(moment(params.from), "years", true);
  }

  let attributes, group;
  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("ROUND(SUM(kwh_session), 2)"), "totalKwhSession"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
        "day",
      ],
      [sequelize.literal("ROUND(SUM(kwh_session), 2)"), "totalKwhSession"],
    ];
    group = ["day"];
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
  userId: number
) => {
  let attributes, group;
  let year: number | null = null;

  if (params.from && params.to) {
    params.from = moment(params.from)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ssZ");
    params.to = moment(params.to).endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

    year = moment(params.to).diff(moment(params.from), "years", true);
  }

  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("ROUND(SUM(total_cost), 2)"), "totalCost"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
        "day",
      ],
      [sequelize.literal("ROUND(SUM(total_cost), 2)"), "totalCost"],
    ];
    group = ["day"];
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
  role: string,
  userId: number
) => {
  const { EVChargeStationTrans } = Models;
  let year: number | null = null;
  let attributes, group;

  if (params.from && params.to) {
    params.from = moment(params.from)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ssZ");
    params.to = moment(params.to).endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

    year = moment(params.to).diff(moment(params.from), "years", true);
  }

  if (year && year > 1) {
    attributes = [
      [sequelize.fn("month", sequelize.col("createdAt")), "month"],
      [sequelize.literal("COUNT(*)"), "chargeSessionCount"],
    ];
    group = [sequelize.fn("month", sequelize.col("createdAt"))];
  } else {
    attributes = [
      [
        sequelize.fn("DATE_FORMAT", sequelize.col("createdAt"), "%Y-%m-%d"),
        "day",
      ],
      [sequelize.literal("COUNT(*)"), "chargeSessionCount"],
    ];
    group = ["day"];
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
    let chargeStations: number[];
    if (user.locations.length > 0) {
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

  const data = await EVChargeStationTrans.findAll({
    where,
    attributes,
    group,
    raw: true,
  });

  const totalChargeSessionCount: number = data.reduce(
    (sum: number, record: any) => sum + record.chargeSessionCount,
    0
  );

  return {
    totalChargeSessionData: data,
    totalChargeSessionsCount: +totalChargeSessionCount.toFixed(2),
  };
};

const reportDownload = async (data: { [key: string]: any }) => {
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Energy Utilization Report");

  const dataKeys = Object.keys(data);
  const columnNames = Object.keys(data[dataKeys[0]][0]);

  worksheet.addRow(" ".repeat(2).split(" "));
  worksheet.addRow([...columnNames]);
  worksheet.addRow(" ".repeat(2).split(" "));

  data[dataKeys[0]]?.forEach((record: { [key: string]: any }) => {
    worksheet.addRow([record[columnNames[0]], record[columnNames[1]]]);
  });

  worksheet.addRow(" ".repeat(2).split(" "));
  worksheet.addRow([dataKeys[1], data[dataKeys[1]]]);

  const buffer = await workbook.csv.writeBuffer();
  return buffer;
};

export default {
  energyUtilizationReport,
  generatedRevenueReport,
  totalChargesReport,
  reportDownload,
};
