import sequelize from "../../utils/db-connection";
import Sequelize from "sequelize";
import { CO2CertificateAuthorityModel } from "../../types/co2CertificateAuthority";

const CO2CertificateAuthority = sequelize.define<CO2CertificateAuthorityModel>(
  "co2_certificate_authority",
  {
    co2_certificate_agency_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    agent_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "agent name is a mandatory field",
        },
      },
    },
    dept_name: {
      type: Sequelize.STRING(20),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "dept name is a mandatory field",
        },
      },
    },
    website: {
      type: Sequelize.STRING(25),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "website is a mandatory field",
        },
      },
    },
  },
  {
    tableName: "co2_certificate_authority",
    paranoid: true,
    timestamps: true,
  }
);

export default CO2CertificateAuthority;
