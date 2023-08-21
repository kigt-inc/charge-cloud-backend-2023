import Certificate from "./certificate";
import ChargeStation from "./chargeStation";
import Client from "./client";
import Customer from "./customer";
import EVChargeStationTrans from "./evChargerStationTrans";
import EVChargerTimestamp from "./evChargerTimestamp";
import Location from "./location";
import Merchant from "./merchant";
import Role from "./role";
import UserRole from "./userRole";
import User from "./user";
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
  UserRole,
  User,
});

export default Models;
