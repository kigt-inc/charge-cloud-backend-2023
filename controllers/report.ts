import _ from "lodash";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import moment from "moment";
import reportServices from "../services/report";

/* Create new location */
const energyUtilizationReport: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;
    let year: number | null = null;
    let chargesType: boolean = false;
    if (params.from && params.to) {
      params.from = moment(params.from)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      params.to = moment(params.to).endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

      year = moment(params.to).diff(moment(params.from), "years", true);
    }

    if (req.url.includes("charges-transaction")) {
      chargesType = true;
    }

    const data = await reportServices.energyUtilizationReport(
      params,
      year,
      req?.role,
      req?.id,
      chargesType
    );
    res.status(200).json({
      isSuccess: true,
      data: data,
      message: CONSTANTS.DATA_FETCHED,
    });
  } catch (error: any) {
    let errorMessage;
    if (error?.name == "SequelizeUniqueConstraintError") {
      errorMessage = error?.errors[0]?.message;
    }
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: errorMessage ? errorMessage : CONSTANTS.INTERNAL_SERVER_ERROR,
    });
  }
};

/* Create new location */
const generatedRevenueReport: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;
    let year: number | null = null;
    if (params.from && params.to) {
      params.from = moment(params.from)
        .startOf("day")
        .format("YYYY-MM-DDTHH:mm:ssZ");
      params.to = moment(params.to).endOf("day").format("YYYY-MM-DDTHH:mm:ssZ");

      year = moment(params.to).diff(moment(params.from), "years", true);
    }
    
    const data = await reportServices.generatedRevenueReport(
      params,
      req?.role,
      req?.id,
      year
    );
    res.status(200).json({
      isSuccess: true,
      data: data,
      message: CONSTANTS.DATA_FETCHED,
    });
  } catch (error: any) {
    console.log(error, "error");

    let errorMessage;
    if (error?.name == "SequelizeUniqueConstraintError") {
      errorMessage = error?.errors[0]?.message;
    }
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: errorMessage ? errorMessage : CONSTANTS.INTERNAL_SERVER_ERROR,
    });
  }
};

export default {
  energyUtilizationReport,
  generatedRevenueReport,
};
