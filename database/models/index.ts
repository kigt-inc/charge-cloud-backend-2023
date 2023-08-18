import Certificate from "./certificate";
import ChargeStation from "./chargeStation";
import Client from "./client";
import Customer from "./customer";
import EVChargeStationTrans from "./evChargerStationTrans";
import EVChargerTimestamp from "./evChargerTimestamp";
import Location from "./location";
import Merchant from "./merchant";
import Role from "./role";
import { relations } from "./modelRelations";
import TransactionTimestamp from "./transactionTimestamp";

const Models = relations.associateRelationships({
  ChargeStation,
  EVChargerTimestamp,
  Certificate,
  Customer,
  Merchant,
  TransactionTimestamp,
  Client,
  EVChargeStationTrans,
  Location,
  Role,
});

export default Models;
