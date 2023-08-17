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
import { ChargeStationsAttributes } from "../types/chargeStation";
import { Transaction } from "sequelize";
import { EventTimestampsAttributes } from "../types/eventTimestamp";
import { initIO } from "../utils/socket";

type errCaseHandleAttributes = {
  lastTimestampInfo: Partial<EVChargerTimestampsAttributes>;
  data: { [key: string]: any };
  html_body: string;
  reason: string;
  priority: string;
  transaction: Transaction;
};

type errCaseFunction = (
  errCaseObj: errCaseHandleAttributes
) => Promise<{ [key: string]: any }>;

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

const createInsertObj = (
  data: { [key: string]: any },
  transactionTimestampId: number | null
) => {
  const insertObj: Partial<EVChargerTimestampsAttributes> = {
    serial_no: data["Serial Number"],
    evse_last_transaction_payment_id: data["EVSE Last Transaction Payment id"],
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
    transaction_timestamps_id: transactionTimestampId!,
    //process_indicator
    //evse_energy_usage
  };

  return insertObj;
};

const zendeskTicketCreation = async (html_body: string, priority: string) => {
  const ticketData = JSON.stringify({
    ticket: {
      comment: {
        html_body,
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
  return response;
};

const errCaseHandle: errCaseFunction = async ({
  lastTimestampInfo,
  data,
  html_body,
  reason,
  priority,
  transaction,
}) => {
  let transactionTimestampId, createObj, result, transObj, chargeStationObj;

  await zendeskTicketCreation(html_body, priority); 
  if (lastTimestampInfo?.transaction_timestamps_id! !== undefined) {
    transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id!;
  } else {
    const transactionTimestampInfo =
      await transactionTimestampServices.createTransactionTimestamp();
    transactionTimestampId = transactionTimestampInfo?.transaction_timestamp_id;
  }
  createObj = createInsertObj(data, transactionTimestampId);
  result = await evChargerTimestampsServices.createEVChargerTimestamp(
    createObj,
    transaction
  );
  transObj = {
    transaction_timestamp_id: transactionTimestampId!,
    transaction_stop_reason: reason,
  };
  chargeStationObj = null;

  return {
    transactionTimestampId,
    result,
    transObj,
    chargeStationObj,
  };
};

/* list summary count */
const createWebHook: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const io = initIO();
    const data = req.body;
    const errorStatusCodes = ["4", "5", "6", "7", "8", "9", "10"];

    let createObj: Partial<EVChargerTimestampsAttributes>,
      transObj: Partial<EVChargeStationTransAttributes> | null,
      chargeStationObj: Partial<ChargeStationsAttributes> | null,
      result: Partial<EventTimestampsAttributes>;
    let html_body: string, reason: string, priority: string;
    let transactionTimestampId: number | null;
    let errCaseResult: { [key: string]: any } | null = null;

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

    const keysDifference = hookKeys.findIndex(
      (hookKey) => !dataKeys.includes(hookKey)
    );

    if (keysDifference > -1) {
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

    if (!chargeStation) {
      await transaction.rollback();
      return res.status(404).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.SERIAL_NO_NOT_FOUND,
      });
    }

    let lastTimestampInfo =
      await evChargerTimestampsServices.lastEVChargerTimestamp(
        data["Serial Number"],
        transaction
      );

    switch (data["EVSE Status Code"]) {
      case "4":
        reason = "Vent Required";
        html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "normal";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "5":
        reason = " Diode Check Failed";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "normal";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "6":
        reason = "GFCI Fault";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "high";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "7":
        reason = "Bad Ground";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "normal";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "8":
        reason = "Stuck Relay";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "high";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "9":
        reason = "GFI Self-Test Failure";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "urgent";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "10":
        reason = "Vent Required";
        html_body =
          html_body = `<p>Problem: <strong>${reason}</strong></p><p>Charge Station Id: <strong>${chargeStation.charge_station_id}</strong></p><p>Timestamp: <strong>${data["status_change_timestamp"]}</strong></p>`;
        priority = "urgent";
        errCaseResult = await errCaseHandle({
          lastTimestampInfo,
          data,
          html_body,
          reason,
          priority,
          transaction,
        });
        break;
      case "1":
        const transactionTimestampInfo =
          await transactionTimestampServices.createTransactionTimestamp();
        transactionTimestampId =
          transactionTimestampInfo?.transaction_timestamp_id;
        createObj = createInsertObj(data, transactionTimestampId!);
        result = await evChargerTimestampsServices.createEVChargerTimestamp(
          createObj,
          transaction
        );
        transObj = {
          transaction_timestamp_id: transactionTimestampId!,
          transaction_status: "Occupied",
          connector_status: "Occupied",
          event_start: data["status_change_timestamp"],
          transaction_stop_reason: "normal",
        };
        chargeStationObj = {
          charge_station_status: "Occupied",
        };
        break;
      case "2":
        if (lastTimestampInfo?.evse_status_code === "255") {
          const transactionTimestampInfo =
            await transactionTimestampServices.createTransactionTimestamp();
          transactionTimestampId =
            transactionTimestampInfo?.transaction_timestamp_id;
        } else {
          transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id;
        }
        createObj = createInsertObj(data, transactionTimestampId);
        result = await evChargerTimestampsServices.createEVChargerTimestamp(
          createObj,
          transaction
        );
        lastTimestampInfo =
          await evChargerTimestampsServices.lastEVChargerTimestamp(
            data["Serial Number"],
            transaction
          );
        if (
          lastTimestampInfo?.evse_status_code === "254" ||
          lastTimestampInfo?.evse_status_code === "3"
        ) {
          transObj = {
            transaction_timestamp_id: transactionTimestampId!,
            transaction_status: "Ended",
            connector_status: "Occupied",
            meter_end: createObj.status_change_timestamp,
            transaction_stop_reason: "normal",
          };
          chargeStationObj = {
            charge_station_status: "“Connected",
          };
          const evChargerStationTran =
            await evChargerStationTransServices.getAllEVChargeStationTransByTransactionTimestampId(
              transactionTimestampId!
            );
          if (evChargerStationTran.length > 0) {
            await evChargerStationTransServices.editEVChargeStationTrans(
              transObj!,
              evChargerStationTran[0]?.charge_record_id,
              transaction
            );
          }
        } else if (lastTimestampInfo?.evse_status_code === "255") {
          transObj = {
            transaction_timestamp_id: transactionTimestampId!,
            transaction_status: "Occupied",
            connector_status: "Occupied",
            event_start: data["status_change_timestamp"],
            transaction_stop_reason: "normal",
          };
          chargeStationObj = {
            charge_station_status: "Occupied",
          };
        } else if (
          errorStatusCodes.includes(lastTimestampInfo?.evse_status_code)
        ) {
          transObj = {
            transaction_stop_reason: "normal",
          };
          chargeStationObj = null;
        } else {
          transObj = null;
          chargeStationObj = null;
        }
        break;
      case "3":
        transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id;
        createObj = createInsertObj(data, transactionTimestampId);
        result = await evChargerTimestampsServices.createEVChargerTimestamp(
          createObj,
          transaction
        );
        lastTimestampInfo =
          await evChargerTimestampsServices.lastEVChargerTimestamp(
            data["Serial Number"],
            transaction
          );

        if (
          lastTimestampInfo?.evse_status_code === "1" ||
          lastTimestampInfo?.evse_status_code === "2"
        ) {
          transObj = {
            transaction_timestamp_id: transactionTimestampId!,
            transaction_status: "Charging",
            connector_status: "Occupied",
            meter_start: data["status_change_timestamp"],
            transaction_stop_reason: "normal",
          };
          chargeStationObj = {
            charge_station_status: "Charging",
          };
          await evChargerStationTransServices.createEVChargeStationTrans(
            transObj!
          );
        }
        break;
      case "254":
      case "255":
        transactionTimestampId = lastTimestampInfo?.transaction_timestamps_id;
        createObj = createInsertObj(data, transactionTimestampId);
        result = await evChargerTimestampsServices.createEVChargerTimestamp(
          createObj,
          transaction
        );
        lastTimestampInfo =
          await evChargerTimestampsServices.lastEVChargerTimestamp(
            data["Serial Number"],
            transaction
          );
        if (lastTimestampInfo?.evse_status_code === "2") {
          const allTimestampsForOneSession =
            await evChargerTimestampsServices.getAllEVChargerTimestampsByTransactionId(
              transactionTimestampId!,
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
          const { status_change_timestamp: chargingStartTimestamp } =
            allTimestampsForOneSession.find(
              (timeStamp: EVChargerTimestampsAttributes) =>
                timeStamp.evse_status_code === "3"
            ) ?? {};
          const energyUsage = (208 * data["EVSE Max Current"]) / 1000;
          if (chargingStartTimestamp) {
            transObj = {
              transaction_timestamp_id: transactionTimestampId!,
              transaction_status: "Ended",
              connector_status: "Available",
              event_end: allTimestampsForOneSession[0].status_change_timestamp,
              event_duration: eventDuration,
              meter_start: chargingStartTimestamp,
              meter_end: allTimestampsForOneSession[0].status_change_timestamp,
              kwh_session: (eventDuration / 60) * energyUsage,
              transaction_stop_reason: "normal",
            };
          } else {
            transObj = {
              transaction_timestamp_id: transactionTimestampId!,
              transaction_status: "Ended",
              connector_status: "Available",
              event_end: allTimestampsForOneSession[0].status_change_timestamp,
              event_duration: eventDuration,
              kwh_session: (eventDuration / 60) * energyUsage,
              transaction_stop_reason: "normal",
            };
          }
        } else {
          transObj = {
            transaction_timestamp_id: transactionTimestampId!,
            transaction_status: "Ended",
            connector_status: "Available",
            transaction_stop_reason: "normal",
          };
        }
        chargeStationObj = {
          charge_station_status: "Available",
        };
        break;
    }

    if (errCaseResult) {
      result = errCaseResult?.result;
      transactionTimestampId = errCaseResult?.transactionTimestampId;
      transObj = errCaseResult?.transObj;
      chargeStationObj = errCaseResult?.chargeStationObj;
    }

    if (transObj!) {
      let evChargerStationTran =
        await evChargerStationTransServices.getAllEVChargeStationTransByTransactionTimestampId(
          transactionTimestampId!
        );
      if (evChargerStationTran.length > 0) {
        await evChargerStationTransServices.editEVChargeStationTrans(
          transObj!,
          evChargerStationTran[evChargerStationTran.length - 1]
            ?.charge_record_id,
          transaction
        );
      } else {
        await evChargerStationTransServices.createEVChargeStationTrans(
          transObj!
        );
      }

      if (chargeStationObj!) {
        const chargeStationUpdated =
          await chargeStationsServices.editChargeStation(
            chargeStationObj!,
            chargeStation?.charge_station_id,
            transaction
          );

        io.emit("chargeStationStatus", chargeStationUpdated);
      }
    }

    await transaction.commit();
    res
      .status(201)
      .send({ isSuccess: true, data: result!, message: "Success" });
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
