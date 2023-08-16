import _ from "lodash";
import Models from "../database/models/index";
import { getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { CertificatesAttributes } from "../types/certificate";

const getAllCertificates = async (params: { [key: string]: any }) => {
  const { Certificate } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        certificate_id: {
          [Sequelize.Op.like]: `%${params.search}%`,
        },
      }
    : {};
  const where = {
    ...searchObj,
  };
  let certificates = await Certificate.findAndCountAll({
    where,
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
    ],
    raw: true,
  });

  return { data: certificates?.rows, count: certificates?.count };
};

/* Create new certificate*/
const createCertificate = async (
  certificateObj: CertificatesAttributes
) => {
  const { Certificate } = Models;
  let certificateCreated = await Certificate.create(certificateObj);
  if (certificateCreated) {
    certificateCreated = certificateCreated?.toJSON();
    return certificateCreated;
  } else {
    return null;
  }
};

const editCertificate = async (
  certificateObj: CertificatesAttributes,
  id: string,
  transaction: Transaction
) => {
  const { Certificate } = Models;
  let certificate = await Certificate.findOne({
    where: {
      certificate_id: id,
    },
    raw: true,
    transaction,
  });
  if (certificate) {
    let certificateUpdated = await Certificate.update(certificateObj, {
      where: { certificate_id: id },
      transaction,
    }).then(async () => {
      return await Certificate.findOne({
        where: { certificate_id: id },
        transaction,
        raw: true,
      });
    });
    return certificateUpdated;
  } else {
    return null;
  }
};

/* get certificate by id */
const getCertificate = async (id: string) => {
  const { Certificate } = Models;
  const certificate = await Certificate.findOne({
    where: {
      certificate_id: id,
    },
    raw: true,
  });

  return certificate || null;
};

/* Soft delete certificate */
const deleteCertificate = async (id: string) => {
  const { Certificate } = Models;
  const certificateDeleted = await Certificate.destroy({
    where: {
      certificate_id: id,
    },
    individualHooks: true,
  });
  return certificateDeleted;
};

export default {
  getAllCertificates,
  createCertificate,
  editCertificate,
  getCertificate,
  deleteCertificate,
};
