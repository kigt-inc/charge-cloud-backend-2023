import { Model } from "sequelize";

export interface DemandResponseEventsAttributes {
  demand_response_event_id: number;
  utility_id: number;
  event_start: Date;
  event_end: Date;
}

export type DemandResponseEventsModel = Model<DemandResponseEventsAttributes> &
  DemandResponseEventsAttributes;
