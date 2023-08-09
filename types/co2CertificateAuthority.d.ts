import { Model } from "sequelize";

export interface CO2CertificateAuthorityAttributes {
  co2_certificate_agency_id: number;
  agent_name: string;
  dept_name: string;
  website: string;
}

export type CO2CertificateAuthorityModel =
  Model<CO2CertificateAuthorityAttributes> & CO2CertificateAuthorityAttributes;
