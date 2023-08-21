import _ from "lodash";
import Models from "../database/models/index";
import Sequelize from "sequelize";
import moment from "moment";
import sequelize from "../utils/db-connection";

const energyUtilizationReport = async (
  params: { [key: string]: any },
  year: number | null,
  chargesType: boolean
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

  if (chargesType) {
    attributes = [
      ...attributes,
      [sequelize.literal("ROUND(SUM(total_cost), 2)"), "totalCost"],
    ];
  }

  const data = await EVChargeStationTrans.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gte]: params.from
          ? params.from
          : moment().subtract(1, "month").toDate(),
        [Sequelize.Op.lte]: params.to ? params.to : moment().toDate(),
      },
      transaction_status: "Available",
    },
    attributes,
    group,
    raw: true,
  });

  if (chargesType) {
    const totalCostSum: number = data.reduce(
      (sum: number, record: any) => sum + record.totalCost,
      0
    );

    return {
      chargesTransactionData: data,
      totalCostSum: +totalCostSum.toFixed(2),
    };
  } else {
    const totalKwhSum: number = data.reduce(
      (sum: number, record: any) => sum + record.totalKwhSession,
      0
    );

    return {
      energyUtilizationData: data,
      totalKwhSum: +totalKwhSum.toFixed(2),
    };
  }
};

const generatedRevenueReport = async (
  params: { [key: string]: any },
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

  const { EVChargeStationTrans } = Models;
  const data = await EVChargeStationTrans.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gte]: params.from
          ? params.from
          : moment().subtract(1, "month").toDate(),
        [Sequelize.Op.lte]: params.to ? params.to : moment().toDate(),
      },
      transaction_status: "Available",
    },
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

export default {
  energyUtilizationReport,
  generatedRevenueReport,
};
