import "dotenv/config";
import moment from "moment";
import _ from "lodash";
import jwt from "jsonwebtoken";

/* Validate email */
export const validateEmail = (emailAdress: string) => {
  let regexEmail = /^\w+([+\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (emailAdress.match(regexEmail)) {
    return true;
  } else {
    return false;
  }
};

export const generateExpirationTime = () => {
  return moment().add(process.env.OTP_EXPIRE_MINUTES, "minutes");
};

export const otpGenerator = () => {
  var digits = "0123456789";
  let otp = "";
  for (let i = 0; i < 4; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const passCodeGenerator = () => {
  var digits = "0123456789";
  let passcode = "";
  for (let i = 0; i < 6; i++) {
    passcode += digits[Math.floor(Math.random() * 10)];
  }
  return passcode;
};

export const validateOtp = (
  otpDetails: { emailOtp: string; expirationTime: Date },
  receivedEmailOtp: string
) => {
  if (otpDetails?.emailOtp) {
    if (otpDetails.emailOtp == receivedEmailOtp) {
      console.log(moment(), "cur");
      console.log(moment(otpDetails.expirationTime), "expr");

      if (moment().isBefore(moment(otpDetails.expirationTime))) {
        return true;
      } else {
        return "expired";
      }
    } else {
      if (otpDetails.emailOtp != receivedEmailOtp) {
        return "invalidEmailOtp";
      }
    }
  } else {
    return "invalidOtp";
  }
};

export const getPagination = (
  page: number,
  size: string,
  defaultSize: number
) => {
  const limit = size ? +size : defaultSize;
  const offset = page ? (page - 1) * limit : 0;
  return { limit, offset };
};

export const omitBeforeAddEdit = (obj: object, otherFields: string[] = []) => {
  return _.omit(obj, [
    "id",
    "status",
    "createdAt",
    "updatedAt",
    "createdBy",
    "updatedBy",
    "deletedAt",
    ...otherFields,
  ]);
};

// check is valid url
export const isValidUrl = (str: string) => {
  try {
    new URL(str);
    return true;
  } catch (err) {
    return false;
  }
};

// check is valid uuid string
export const isValidUUID = (str: string) => {
  // Regular expression to check if string is a valid UUID
  const regexExp =
    /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
  return regexExp.test(str);
};

//generate JWT token
export const generateJWT = (data: object) => {
  const token = jwt.sign(data, process.env.JWT_SECRET_KEY!, {});
  return token;
};

//decode JWT token
export const decodeJWT = (token: string) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY!);
  return decodedToken;
};

export const trim = function (e: string) {
  if (!(e === "" || e === null || e === void 0)) {
    return e.replace(/^\s+/, "").replace(/\s+$/, "");
  } else {
    throw new Error("Please specify an argument!");
  }
};
