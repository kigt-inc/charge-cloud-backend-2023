import _ from "lodash";
import Models from "../database/models/index";
import CONSTANTS from "../utils/constants";
import { validateEmail, getPagination } from "../utils/helpers";
import Sequelize, { Transaction } from "sequelize";
import { UsersAttributes } from "../types/user";

/* Create new user */
const signup = async (userObj: UsersAttributes) => {
  const { User, Role, UserRole } = Models;
  const roleObj = await Role.findOne({
    where: {
      role_name: userObj.role,
    },
    raw: true,
  });

  let userCreated = await User.create(userObj);

  const userRoleObj = {
    user_id: userCreated.user_id,
    role_id: roleObj.role_id,
  };
  let userRoleCreated = await UserRole.create(userRoleObj);
  if (userCreated && userRoleCreated) {
    userCreated = userCreated?.toJSON();
    userCreated.role = userObj.role;
    return userCreated;
  } else {
    return null;
  }
};

/* Login admin user */
const signin = async (userObj: UsersAttributes) => {
  const { User, Role, UserRole } = Models;
  let userLogged = await User.findOne({
    where: {
      email: userObj.email,
      user_status: "active",
    },
    include: [
      {
        model: UserRole,
        attributes: [],
        include: [{ model: Role, attributes: ["role_name"] }],
      },
    ],
    raw: true,
  });

  if (userLogged) {
    userLogged.role = userLogged["user_role.role.role_name"];
    return _.omit(userLogged, [
      "user_role.role.role_id",
      "user_role.role.role_name",
    ]);
  } else {
    return null;
  }
};

/* validate user params */
const userValidation = (params: Partial<UsersAttributes>) => {
  let validationResponse;
  if (params.first_name === "" || params.first_name === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} firstName ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.last_name === "" || params.last_name === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} lastName ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.phone_no === "" || params.phone_no === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} phoneNumber ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (params.password === "" || params.password === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} password ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (
    params.online_access === "" ||
    params.online_access === undefined
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} onlineAccess ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else if (
    (typeof params.merchant_id !== "number" ||
      params.merchant_id === undefined) &&
    params.role !== CONSTANTS.ROLES.SUPERADMIN
  ) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} merchant Id ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  }

  if (params.email === "" || params.email === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `Email Id ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else {
    let emailData = validateEmail(params.email);
    if (emailData) {
      validationResponse = {
        isValid: true,
      };
    } else {
      validationResponse = {
        isValid: false,
        message: {
          isSuccess: false,
          data: [],
          message: `${CONSTANTS.PLEASE_PROVIDE_VALID} email ID`,
        },
      };
    }
  }

  return validationResponse;
};

/* Soft delete user */
const deleteUser = async (userId: number) => {
  const { User } = Models;
  const userDeleted = await User.destroy({
    where: {
      user_id: userId,
    },
    individualHooks: true,
  });
  return userDeleted;
};

/* validate request for sign in */
const userSignInValidation = (params: UsersAttributes) => {
  let validationResponse;

  if (params.email === "" || params.email === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `email ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else {
    let emailData = validateEmail(params.email);

    if (emailData) {
      validationResponse = {
        isValid: true,
      };
    } else {
      validationResponse = {
        isValid: false,
        message: {
          isSuccess: false,
          data: [],
          message: `${CONSTANTS.PLEASE_PROVIDE_VALID} email ID`,
        },
      };
    }
  }

  if (params.password === "" || params.password === undefined) {
    validationResponse = {
      isValid: false,
      message: {
        isSuccess: false,
        data: [],
        message: `${CONSTANTS.PLEASE_PROVIDE_VALID} password ${CONSTANTS.IS_MANDATORY_FIELD}`,
      },
    };

    return validationResponse;
  } else {
    validationResponse = {
      isValid: true,
    };
  }

  return validationResponse;
};

/* list all admin users */
const listUsers = async (params: { [key: string]: any }) => {
  const { User, Role, UserRole } = Models;
  const { limit, offset } = getPagination(params?.page, params?.limit, 10);
  const searchObj = params?.search
    ? {
        [Sequelize.Op.or]: [
          { email: { [Sequelize.Op.like]: `%${params.search}%` } },
          { first_name: { [Sequelize.Op.like]: `%${params.search}%` } },
          { last_name: { [Sequelize.Op.like]: `%${params.search}%` } },
        ],
      }
    : {};
  const where = {
    user_status:
      params?.status && CONSTANTS.STATUS.includes(params.status)
        ? params.status
        : CONSTANTS.STATUS,
    ...searchObj,
  };
  let allUsers = await User.findAndCountAll({
    where,
    include: [
      {
        model: UserRole,
        attributes: [],
        include: [
          {
            model: Role,
            attributes: ["role_name"],
            where: {
              role_name:
                params?.role &&
                Object.values(CONSTANTS.ROLES).includes(params.role)
                  ? params.role
                  : Object.values(CONSTANTS.ROLES),
            },
          },
        ],
      },
    ],
    attributes: { exclude: ["password", "token"] },
    limit,
    offset,
    order: [
      params?.sortBy && params?.order
        ? [params.sortBy, params.order]
        : ["createdAt", "DESC"],
    ],
    raw: true,
  });
  let groupByCount = await User.count({
    where,
    group: ["user_status"],
  });
  const data = _.map(allUsers?.rows, (user) => {
    user.role = user["user_role.role.role_name"];
    delete user["user_role.role.role_id"];
    delete user["user_role.role.role_name"];
    return user;
  });
  const active =
    groupByCount &&
    groupByCount.find((x: { user_status: string }) => x.user_status == "active")
      ? groupByCount.find(
          (x: { user_status: string }) => x.user_status == "active"
        ).count
      : 0;
  const inactive =
    groupByCount &&
    groupByCount.find(
      (x: { user_status: string }) => x.user_status == "inactive"
    )
      ? groupByCount.find(
          (x: { user_status: string }) => x.user_status == "inactive"
        ).count
      : 0;
  return { data: allUsers?.rows, count: allUsers?.count, active, inactive };
};

/* list users by id*/
const getUser = async (
  userId: number,
  status: string[] | string = CONSTANTS.STATUS
) => {
  const { User, Role, UserRole, Client, Merchant, ChargeStation, Location } =
    Models;
  let user = await User.findOne({
    where: {
      user_id: userId,
      user_status: status,
    },
    include: [
      {
        model: UserRole,
        attributes: ["user_role_id"],
        include: [{ model: Role, attributes: ["role_name"] }],
      },
      {
        model: Client,
        attributes: ["client_id"],
        as: "client",
        include: [
          {
            model: Location,
            as: "locations",
            include: [
              {
                model: ChargeStation,
                as: "chargeStations",
              },
            ],
          },
        ],
      },
      {
        model: Merchant,
        attributes: ["merchant_id"],
        as: "merchant",
      },
    ],
  });
  
  if (user) {
    user = user.toJSON();
    user.role = _.get(user, "user_role.role.role_name");
    user.client_id = _.get(user, "client.client_id") ?? null;
    user.merchant_id = _.get(user, "merchant.merchant_id") ?? null;
    user.locations = _.get(user, "client.locations") ?? [];
    user = _.omit(user, ["user_role", "merchant", "client"]);
    return user;
  } else {
    return null;
  }
};

/* for edit user */
const editUser = async (
  updateObj: Partial<UsersAttributes>,
  userId: string,
  transaction: Transaction
) => {
  const { User, UserRole, Role } = Models;

  let updatedUser = await User.update(updateObj, {
    where: { user_id: userId },
    transaction,
  }).then(async () => {
    return await User.findOne({
      where: { user_id: userId },
      attributes: { exclude: ["password"] },
      transaction,
      raw: true,
    });
  });

  if (!updatedUser) {
    return null;
  }

  // if (updateObj.password) {
  //   updatedUser.newPassword = updateObj.password;
  // }

  if (
    updateObj?.role &&
    Object.values(CONSTANTS.ROLES).includes(updateObj.role) &&
    updatedUser?.user_id
  ) {
    const roleObj = await Role.findOne({
      where: { role_name: updateObj.role },
      raw: true,
    });

    const userRoleObj = {
      role_id: roleObj?.role_id,
    };
    await UserRole.update(userRoleObj, {
      where: { user_id: updatedUser?.user_id },
      transaction,
    });
    updatedUser.role = updateObj.role;
  }
  return updatedUser;
};

/* for patch user status active / inactive */
const patchUserStatus = async (userId: number) => {
  const { User } = Models;
  let user = await User.findOne({
    where: {
      user_id: userId,
    },
    attributes: ["user_status"],
    raw: true,
  });
  if (user && user.user_status && CONSTANTS.STATUS.includes(user.user_status)) {
    user = user.user_status == "inactive" ? "active" : "inactive";
    let updatedStatus = await User.update(
      { user_status: user },
      {
        where: { user_id: userId },
      }
    ).then(async () => {
      return await User.findOne({
        where: { user_id: userId },
        attributes: { exclude: ["password"] },
        raw: true,
      });
    });
    return _.pick(updatedStatus, ["user_status"]);
  } else {
    return null;
  }
};

export default {
  signin,
  signup,
  editUser,
  userSignInValidation,
  deleteUser,
  patchUserStatus,
  getUser,
  listUsers,
  userValidation,
};
