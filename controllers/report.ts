import _ from "lodash";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import reportServices from "../services/report";

/* generate energyUtilizationReport */
const energyUtilizationReport: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;

    const data = await reportServices.energyUtilizationReport(
      params,
      req?.role,
      req?.id
    );

    res.status(200).json({
      isSuccess: true,
      data: data,
      message: CONSTANTS.DATA_FETCHED,
    });
  } catch (error: any) {
    console.log(error,"err");
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

/* generate generatedRevenueReport */
const generatedRevenueReport: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;

    const data = await reportServices.generatedRevenueReport(
      params,
      req?.role,
      req?.id
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

/* generate totalChargesReport */
const totalChargesReport: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;

    const data = await reportServices.totalChargesReport(
      params,
      req?.role,
      req?.id
    );
    res.status(200).json({
      isSuccess: true,
      data: data,
      message: CONSTANTS.DATA_FETCHED,
    });
  } catch (error: any) {
    console.log(error, "err");
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

const energyUtilizationReportDownload: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    let params: { [key: string]: any } = req.query;
    const data = await reportServices.energyUtilizationReport(
      params,
      req?.role,
      req?.id
    );

    if (data?.energyUtilizationData.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NO_DATA_FOR_FILE,
      });
    }

    const buffer = await reportServices.reportDownload(data);

    // Set response headers for file download
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="energy_utilization_report.csv"'
    );
    res.setHeader("Content-Type", "text/csv");

    // Send the CSV data as a downloadable file
    res.status(200).send(buffer);
  } catch (error: any) {
    console.log(error, "err");

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

const generatedRevenueReportDownload: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    let params: { [key: string]: any } = req.query;
    const data = await reportServices.generatedRevenueReport(
      params,
      req?.role,
      req?.id
    );

    if (data?.generateRevenueData.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NO_DATA_FOR_FILE,
      });
    }

    const buffer = await reportServices.reportDownload(data);

    // Set response headers for file download
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="generated_revenue_report.csv"'
    );
    res.setHeader("Content-Type", "text/csv");

    // Send the CSV data as a downloadable file
    res.status(200).send(buffer);
  } catch (error: any) {
    console.log(error, "err");

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

const totalChargesReportDownload: RequestHandler = async (req, res, next) => {
  try {
    let params: { [key: string]: any } = req.query;
    const data = await reportServices.totalChargesReport(
      params,
      req?.role,
      req?.id
    );

    if (data?.totalChargeSessionData.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NO_DATA_FOR_FILE,
      });
    }

    const buffer = await reportServices.reportDownload(data);

    // Set response headers for file download
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="total_charge_sessions_report.csv"'
    );
    res.setHeader("Content-Type", "text/csv");

    // Send the CSV data as a downloadable file
    res.status(200).send(buffer);
  } catch (error: any) {
    console.log(error, "err");

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
  totalChargesReport,
  energyUtilizationReportDownload,
  generatedRevenueReportDownload,
  totalChargesReportDownload,
};
