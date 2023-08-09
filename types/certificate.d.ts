import { Model } from "sequelize";

export interface CertificatesAttributes {
  certificate_id: number;
  co2_certificate_agency_id: number;
  kigt_account: string;
  co2_information: string;
  start_period: Date;
  end_period: Date;
  status: string;
}

export type CertificatesModel = Model<CertificatesAttributes> &
  CertificatesAttributes;
