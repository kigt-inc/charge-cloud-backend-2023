import { RequestHandler } from "express";
import jwt, { Secret } from "jsonwebtoken";
import CONSTANTS from "../utils/constants";
import userServices from "../services/user";
import { TokenPayload } from "../types/token";

/* Middleware to verify User Token */
const verifyToken: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  const authHeader = req.headers.authorization;
  try {
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7, authHeader.length);

      if (!token)
        return res.status(401).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.AUTH_ERROR,
        });

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as Secret
      ) as TokenPayload;

      if (!decoded) {
        return res.status(401).send({
          message: CONSTANTS.AUTH_ERROR,
        });
      }
      req.id = decoded?.id;
      const user = await userServices.getUser(decoded?.id, "active");
      if (!user) {
        return res.status(401).json({
          isSuccess: false,
          data: {},
          message: CONSTANTS.AUTH_ERROR,
        });
      }
      req.role = decoded.role;
      next();
    } else {
      return res.status(401).json({
        isSuccess: false,
        data: {},
        message: CONSTANTS.AUTH_ERROR,
      });
    }
  } catch (error) {
    res.status(401).json({
      isSuccess: false,
      data: {},
      message: CONSTANTS.AUTH_ERROR,
    });
  }
};
/* Middleware to check if loggedIn role is Super Admin */
const isSuperAdmin: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "superadmin") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.SUPER_ADMIN_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.INTERNAL_SERVER_ERROR,
    });
  }
};

/* Middleware to check if loggedIn role is client */
const isClient: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "client") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.CLIENT_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.CLIENT_ROLE_REQUIRED,
    });
  }
};

/* Middleware to check if loggedIn role is user */
const isUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "user") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.USER_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.USER_ROLE_REQUIRED,
    });
  }
};

/* Middleware to check if loggedIn role is Super Admin or Client */
const isSuperAdminOrClient: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "superadmin" || role === "client") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.SUPER_ADMIN_OR_CLIENT_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.SUPER_ADMIN_OR_CLIENT_ROLE_REQUIRED,
    });
  }
};

/* Middleware to check if loggedIn role is Super Admin or Client or User */
const isSuperAdminOrClientOrUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "superadmin" || role === "client" || role === "user") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.SUPER_ADMIN_OR_CLIENT_OR_USER_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.SUPER_ADMIN_OR_CLIENT_OR_USER_ROLE_REQUIRED,
    });
  }
};

/* Middleware to check if loggedIn role is Super Admin or User */
const isSuperAdminOrUser: RequestHandler = async (
  req,
  res,
  next
): Promise<void | object> => {
  try {
    const role = req.role;
    if (role === "superadmin" || role === "user") {
      return next();
    }
    return res.status(403).send({
      message: CONSTANTS.SUPER_ADMIN_OR_USER_ROLE_REQUIRED,
    });
  } catch (error) {
    return res.status(500).send({
      message: CONSTANTS.SUPER_ADMIN_OR_USER_ROLE_REQUIRED,
    });
  }
};

const auth = {
  isUser,
  isSuperAdmin,
  isClient,
  isSuperAdminOrClient,
  verifyToken,
  isSuperAdminOrClientOrUser,
  isSuperAdminOrUser,
};

export default auth;
