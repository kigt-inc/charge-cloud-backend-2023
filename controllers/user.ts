import _ from "lodash";
import userServices from "../services/user";
import CONSTANTS from "../utils/constants";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { omitBeforeAddEdit } from "../utils/helpers";
import { RequestHandler } from "express";
import { UsersAttributes } from "../types/user";
import sequelize from "../utils/db-connection";

/* Register new user */
const signup: RequestHandler = async (req, res, next) => {
  try {
    let createObj = req.body;
    const role = req.query.role;
    if (!role && req.url.includes("signup")) {
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    createObj.role = CONSTANTS.ROLES.CLIENT;
    createObj.cust_admin = "n";
    createObj = omitBeforeAddEdit(createObj, ["user_id"]);
    if (req.url.includes("signup")) {
      if (role === CONSTANTS.ROLES.USER) {
        createObj.role = CONSTANTS.ROLES.USER;
        createObj.cust_admin = "n";
      } else {
        createObj.role = CONSTANTS.ROLES.SUPERADMIN;
        createObj.cust_admin = "y";
      }
    }

    let checkUserValidation = await userServices.userValidation(createObj);
    if (checkUserValidation && !checkUserValidation.isValid) {
      res.status(400).json(checkUserValidation.message);
    } else {
      let addUser = await userServices.signup(createObj);
      res.status(201).json({
        isSuccess: true,
        data: _.omit(addUser, ["password"]),
        message: CONSTANTS.USER_CREATED,
      });
    }
    next();
  } catch (error: any) {
    let errorMessage;
    if (error?.name == "SequelizeUniqueConstraintError") {
      errorMessage = error?.errors[0]?.message;
    }
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: errorMessage ? errorMessage : CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};
/* For Admin User Login */
const signin: RequestHandler = async (req, res, next) => {
  try {
    const params = req.body;
    let checkUserValidation = await userServices.userSignInValidation(params);

    if (checkUserValidation && !checkUserValidation.isValid) {
      res.status(400).json(checkUserValidation.message);
    } else {
      let loggedUser = await userServices.signin(params);
      if (!loggedUser) {
        return res.status(404).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.USER_NOT_FOUND,
        });
      }
      const passwordIsValid = bcrypt.compareSync(
        req.body.password,
        loggedUser.password
      );
      if (!passwordIsValid) {
        return res.status(401).send({
          message: CONSTANTS.INVALID_CREDENTIALS,
        });
      }
      const token = jwt.sign(
        { id: loggedUser.user_id, role: loggedUser.role },
        process.env.JWT_SECRET_KEY!,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }
      );
      loggedUser.token = token;
      res.status(200).json({
        isSuccess: true,
        data: _.omit(loggedUser, ["password"]),
        message: CONSTANTS.USER_SIGNIN,
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};
/* For Edit Admin User */
const editUser: RequestHandler = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const userId = req.params.id;
    if (!userId) {
      await transaction.rollback();
      return res.status(403).send({
        isSuccess: false,
        data: {},
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let updateObj: Partial<UsersAttributes> = omitBeforeAddEdit(req.body, [
      "user_id",
    ]);
    let checkUserValidation = userServices.userValidation(updateObj);
    if (checkUserValidation && !checkUserValidation.isValid) {
      res.status(400).json(checkUserValidation.message);
    } else {
      const updatedProfile = await userServices.editUser(
        updateObj,
        userId,
        transaction
      );

      if (!updatedProfile) {
        await transaction.rollback();
        return res.status(400).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.USER_NOT_FOUND,
        });
      }
      await transaction.commit();
      res.status(200).json({
        isSuccess: true,
        data: updatedProfile,
        message: CONSTANTS.UPDATED,
      });
    }
    next();
  } catch (error: any) {
    let errorMessage;
    if (error?.name == "SequelizeUniqueConstraintError") {
      errorMessage = error?.errors[0]?.message;
    }
    await transaction.rollback();
    res.status(500).json({
      isSuccess: false,
      data: {},
      message: errorMessage ? errorMessage : CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};
/* For Soft Delete Admin User */
const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(403).send({
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    let userDeleted = await userServices.deleteUser(Number(userId));
    res.status(200).json({
      isSuccess: true,
      data: {},
      message: CONSTANTS.USER_DELETED,
    });
    next();
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};
/* For List All Admin Users */
const listUsers: RequestHandler = async (req, res, next) => {
  try {
    const params = req.query;
    if (params?.id) {
      const user = await userServices.getUser(Number(params.id));
      if (!user) {
        return res.status(400).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.USER_NOT_FOUND,
        });
      } else {
        return res.status(200).json({
          isSuccess: true,
          data: _.omit(user, ["password", "token"]),
          message: CONSTANTS.DATA_FETCHED,
        });
      }
    }
    const { data, count, active, inactive } = await userServices.listUsers(
      params
    );
    res.status(200).json({
      isSuccess: true,
      data,
      count,
      active,
      inactive,
      message: CONSTANTS.DATA_FETCHED,
    });
    next();
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};
/* For Update Admin Users Status active / inactive */
const patchUserStatus: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(403).send({
        message: CONSTANTS.INVALID_PARAMS,
      });
    }
    const status = await userServices.patchUserStatus(Number(userId));
    if (!status) {
      return res.status(400).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.USER_NOT_FOUND,
      });
    }
    res.status(200).json({
      isSuccess: true,
      data: status,
      message: CONSTANTS.STATUS_UPDATED,
    });
  } catch (error) {
    res.status(500).json({
      isSuccess: false,
      errorLog: error,
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
    next(error);
  }
};

export default {
  signin,
  signup,
  editUser,
  deleteUser,
  patchUserStatus,
  listUsers,
};
