import "dotenv/config";
import CONSTANTS from "../utils/constants";
import { RequestHandler } from "express";
import sequelize from "../utils/db-connection";
import evChargerTimestampsServices from "../services/evChargerTimestamp";
import chargeStationsServices from "../services/chargeStation";
import { EVChargerTimestampsAttributes } from "../types/evChargerTimestamp";
import transactionTimestampServices from "../services/transactionTimestamp";
import { EVChargeStationTransAttributes } from "../types/evChargeStationTrans";
import moment from "moment";
import evChargerStationTransServices from "../services/evChargerStationTrans";
import axios from "axios";

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
  const transaction = await sequelize.transaction();
  try {
    const data = req.body;
    let body, priority;
    let transactionTimestampId;
    // Validation logic
    const webhookAuth = "kigt_authorization_tams22471$$";
    const authHeader = req.headers["id"];

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
    console.log(data["EVSE Status Code"]);
    console.log(typeof data["EVSE Status Code"]);
    
    if (
      data["EVSE Status Code"] !== "1" &&
      data["EVSE Status Code"] !== "2" &&
      data["EVSE Status Code"] !== "3" &&
      data["EVSE Status Code"] !== "254" &&
      data["EVSE Status Code"] !== "255"
    ) {
      console.log("in switch");
      
      switch (data["EVSE Status Code"]) {
        case "4":
          body = "Vent Required";
          priority = "normal";
          break;
        case "5":
          body = "Diode Check Failed";
          priority = "normal";
          break;
        case "6":
          body = "GFCI Fault";
          priority = "high";
          break;
        case "7":
          body = "Bad Ground";
          priority = "normal";
          break;
        case "8":
          body = "Stuck Relay";
          priority = "high";
          break;
        case "9":
          body = "GFI Self-Test Failure";
          priority = "urgent";
          break;
        case "10":
          body = "Over Temperature Error Shutdown";
          priority = "urgent";
          break;
        default:
          body = "Something Went Wrong";
          priority = "urgent";
          break;
      }

      const ticketData = JSON.stringify({
        ticket: {
          comment: {
            body,
          },
          priority,
          subject: "KIGT Charge Cloud Webhook",
        },
      });

      const passwordString = `${process.env.ZENDESK_USERNAME}:${process.env.ZENDESK_API_TOKEN}`;
      const base64PasswordString = btoa(passwordString);

      const config = {
        method: "POST",
        url: `${process.env.ZENDESK_REMOTE_URL}/tickets`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${base64PasswordString}`, // Base64 encoded "username:password"
        },
        data: ticketData,
      };

      let response = await axios(config);
      return res.status(201).send(response?.data);
    }

    const evChargerTimestamp =
      await evChargerTimestampsServices.getEVChargerTimestamp(
        data["unique_id"],
        transaction
      );

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

    let lastTimestampInfo =
      await evChargerTimestampsServices.lastEVChargerTimestamp(
        data["Serial Number"],
        transaction
      );

    if (data["EVSE Status Code"] === "1" || data["EVSE Status Code"] === "2") {
      if (lastTimestampInfo?.evse_status_code === "255") {
        transactionTimestampId =
          await transactionTimestampServices.createTransactionTimestamp();
        transactionTimestampId =
          transactionTimestampId?.transaction_timestamp_id;
      } else {
        transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id;
      }
    } else if (data["EVSE Status Code"] === "255") {
      transactionTimestampId = null;
    } else {
      transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id;
    }

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
      transaction_timestamps_id: transactionTimestampId,
      //process_indicator
      //evse_energy_usage
    };

    let result =
      await evChargerTimestampsServices.createEVChargerTimestamp(
        insertObj,
        transaction
      );

    if (data["EVSE Status Code"] === "254") {
      lastTimestampInfo =
        await evChargerTimestampsServices.lastEVChargerTimestamp(
          data["Serial Number"],
          transaction
        );
      if (
        lastTimestampInfo?.evse_status_code === "1" ||
        lastTimestampInfo?.evse_status_code === "2" ||
        lastTimestampInfo?.evse_status_code === "3"
      ) {
        const allTimestampsForOneSession =
          await evChargerTimestampsServices.getAllEVChargerTimestampsByTransactionId(
            transactionTimestampId,
            data["Serial Number"]
          );

        const eventDuration = moment(
          allTimestampsForOneSession[0].status_change_timestamp
        ).diff(
          moment(
            allTimestampsForOneSession[allTimestampsForOneSession.length - 1]
              .status_change_timestamp
          ),
          "minutes",
          true
        );

        const { status_change_timestamp: notPluggedTimestamp } =
          allTimestampsForOneSession.find(
            (timeStamp: EVChargerTimestampsAttributes) =>
              timeStamp.evse_status_code === "1"
          ) ?? {};
        const { status_change_timestamp: pluggedTimestamp } =
          allTimestampsForOneSession.find(
            (timeStamp: EVChargerTimestampsAttributes) =>
              timeStamp.evse_status_code === "2"
          ) ?? {};
        const { status_change_timestamp: chargingStartTimestamp } =
          allTimestampsForOneSession.find(
            (timeStamp: EVChargerTimestampsAttributes) =>
              timeStamp.evse_status_code === "3"
          ) ?? {};

        const transObj: Partial<EVChargeStationTransAttributes> = {
          transaction_timestamp_id: transactionTimestampId,
          transaction_status: "ended",
          connector_status: "Available",
          event_start:
            allTimestampsForOneSession[allTimestampsForOneSession.length - 1]
              .status_change_timestamp,
          event_end: allTimestampsForOneSession[0].status_change_timestamp,
          event_duration: eventDuration,
          meter_start: chargingStartTimestamp
            ? chargingStartTimestamp
            : pluggedTimestamp
            ? pluggedTimestamp
            : notPluggedTimestamp,
          meter_end: allTimestampsForOneSession[0].status_change_timestamp,
          kwh_session: (eventDuration / 60) * 5.8,
        };

        await evChargerStationTransServices.createEVChargeStationTrans(
          transObj
        );
      }
    }

    await transaction.commit();
    res.status(201).send({ isSuccess: true, data: result, message: "Success" });

    next();
  } catch (error) {
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
