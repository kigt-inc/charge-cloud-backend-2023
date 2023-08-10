import "dotenv/config";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";
import evChargerTimestampsServices from "../services/evChargerTimestamp";
import chargeStationsServices from "../services/chargeStation";
import { EVChargerTimestampsAttributes } from "../types/evChargerTimestamp";
import transactionTimestampServices from "../services/transactionTimestamp";

const hookKeys: string[] = [
  "Serial Number",
  "unique_id",
  "status_change_timestamp",
  "EVSE Last Transaction Payment id",
  "EVSE Last Transaction Timestamp",
  "EVSE Last Transaction Amount",
  "EVSE Charging Last Timestamp",
  "EVSE Current",
  "EVSE Last Current Timestamp",
  "EVSE Pre Charging Energy",
  "EVSE Energy",
  "EVSE Connected to Interface",
  "EVSE Location",
  "EVSE Max Current",
  "EVSE Payment State",
  "EVSE App Screen",
  "EVSE Status Code Raw",
  "EVSE Status Code",
  "Remote Log",
  "EVSE Temperature",
  "EVSE Throttle Availability Amount",
  "EVSE Throttled",
  "EVSE Voltage",
  "EVSE QuickPay Enabled",
  "EVSE Status Code Command",
];

/* list summary count */
const createWebHook: RequestHandler = async (req, res, next) => {
  const data = req.body;
  console.log(data, "data");

  const transaction = await sequelize.transaction();
  try {
    console.log(req.headers["authorization"]);

    // Validation logic
    const webhookAuth = "kigt_authorization_tams22471$$";
    const authHeader = req.headers["authorization"];

    if (authHeader !== webhookAuth) {
      await transaction.rollback();
      return res
        .status(401)
        .send({ isSuccess: false, data: {}, message: CONSTANTS.AUTH_ERROR });
    }

    if (!data) {
      await transaction.rollback();
      return res.status(204).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.NO_DATA,
      });
    }

    const dataKeys: string[] = Object.keys(data);

    const keysDifference = hookKeys.filter(
      (hookKey) => !dataKeys.includes(hookKey)
    );

    if (keysDifference.length > 0) {
      await transaction.rollback();
      return res.status(400).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.KEYS_NOT_MATCH,
      });
    }

    const evChargerTimestamp =
      await evChargerTimestampsServices.getEVChargerTimestamp(
        data["unique_id"],
        transaction
      );
    console.log(evChargerTimestamp, "evChargerTimestamp");

    if (evChargerTimestamp) {
      await transaction.rollback();
      return res.status(208).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.DUPLICATE_RECORD,
      });
    }

    const chargeStation =
      await chargeStationsServices.getChargeStationBySerialNo(
        data["Serial Number"],
        transaction
      );

    // if (!chargeStation) {
    //   await transaction.rollback();
    //   return res.status(404).send({
    //     isSuccess: false,
    //     data: {},
    //     message: CONSTANTS.SERIAL_NO_NOT_FOUND,
    //   });
    // }

    const transactionTimestamp =
      await transactionTimestampServices.createTransactionTimestamp();

    const insertObj: Partial<EVChargerTimestampsAttributes> = {
      serial_no: data["Serial Number"],
      evse_last_transaction_payment_id:
        data["EVSE Last Transaction Payment id"],
      evse_last_transaction_timestamp: data["EVSE Last Transaction Timestamp"],
      evse_last_transaction_amount: data["EVSE Last Transaction Amount"],
      evse_charging_last_time_stamp: data["EVSE Charging Last Timestamp"],
      evse_current: data["EVSE Current"],
      evse_last_current_timestamp: data["EVSE Last Current Timestamp"],
      EVSE_Pre_Charging_Energy: data["EVSE Pre Charging Energy"],
      evse_energy: data["EVSE Energy"],
      evse_connected_to_interface: data["EVSE Connected to Interface"],
      evse_location: data["EVSE Location"],
      evse_max_current: data["EVSE Max Current"],
      evse_payment_state: data["EVSE Payment State"],
      evse_app_ascreen: data["EVSE App Screen"],
      evse_status_code_raw: data["EVSE Status Code Raw"],
      evse_status_code: data["EVSE Status Code"],
      remote_log: data["Remote Log"],
      evse_temerature: data["EVSE Temperature"],
      evse_throttled: data["EVSE Throttled"],
      evse_voltage: data["EVSE Voltage"],
      evse_quickpay_enabled: data["EVSE QuickPay Enabled"],
      evse_status_code_command: data["EVSE Status Code Command"],
      status_change_timestamp: data["status_change_timestamp"],

      EVSE_Throttle_Availability_Amount:
        data["EVSE Throttle Availability Amount"],
      transaction_timestamps_id: transactionTimestamp.transaction_timestamp_id,
      //process_indicator
      //evse_energy_usage
    };

    let result = await evChargerTimestampsServices.createEVChargerTimestamp(
      insertObj,
      transaction
    );
    console.log(result, "res");

    await transaction.commit();
    res.status(201).send({ isSuccess: true, data: result, message: "Success" });

    next();
  } catch (error) {
    console.log("in");
    await transaction.rollback();
    console.error("Error:", error);
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
  }
};

const getWebhookEvent: RequestHandler = async (req, res, next) => {
  console.log("webhook event details", req.body);
};

export default {
  createWebHook,
  getWebhookEvent,
};
