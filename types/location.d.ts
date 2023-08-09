import { Model } from "sequelize";

export interface LocationsAttributes {
  location_id: number;
  utility_id: number;
  co2_certificate_agency_id: number;
  location_name: string;
  Rate_Type: string;
  client_id: number;
  addr_l1: string;
  addr_l2: string;
  city: string;
  state: string;
  country: string;
  loc_zip: string;
  location_max_reservation: number;
}

export type LocationsModel = Model<LocationsAttributes> & LocationsAttributes;
