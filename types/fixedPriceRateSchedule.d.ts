import { Model } from "sequelize";

export interface FixedPriceRateSchedulesAttributes {
  fixed_price_rate_schedules_id: number;
  fixed_price_id: number;
  start_time: string;
  end_time: string;
  rate: number;
  start_date: Date;
  end_date: Date;
  rate_schedule_type: string;
}

export type FixedPriceRateSchedulesModel =
  Model<FixedPriceRateSchedulesAttributes> & FixedPriceRateSchedulesAttributes;
