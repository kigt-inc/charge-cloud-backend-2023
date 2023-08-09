import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { CertificatesModel } from "../../types/certificate";

const Certificate = sequelize.define<CertificatesModel>(
  "certificates",
  {
    certificate_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    co2_certificate_agency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: "co2_certificate_authority",
        key: "co2_certificate_agency_id",
      },
    },
    kigt_account: {
      type: Sequelize.STRING(25),
      allowNull: false,
    },
    co2_information: {
      type: Sequelize.STRING(20),
      allowNull: false,
    },
    start_period: {
      type: Sequelize.DATE,
    },
    end_period: {
      type: Sequelize.DATE,
    },
    status: {
      type: Sequelize.STRING(15),
      allowNull: false,
    },
  },
  {
    tableName: "certificates",
    paranoid: true,
    timestamps: true,
  }
);

export default Certificate;
