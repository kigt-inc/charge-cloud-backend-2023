import { Model } from "sequelize";

export interface CertificateRulesAttributes {
  rule_id: number;
  co2_certificate_agency_id: number;
  charging_minutes: number;
  end_date: Date;
  desc: string;
}

export type CertificateRulesModel = Model<CertificateRulesAttributes> &
  CertificateRulesAttributes;
