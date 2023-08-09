// import User from "./user";
import ChargeStations from "./chargeStation";
import EVChargerTimestamps from "./evChargerTimestamp";
import { relations } from "./modelRelations";

const Models = relations.associateRelationships({
  ChargeStations,
  EVChargerTimestamps,
});

export default Models;
