import express from "express";
let router = express.Router();
import _ from "lodash";
import webhookRoutes from "./webhook";
import locationRoutes from "./location";
import userRoutes from "./user";
import reportRoutes from "./report";
import zendeskRoutes from "./zendesk";
import clientRoutes from "./client";
import chargeStationRoutes from "./chargeStation";
import merchantRoutes from "./merchant";

/* middleware to filter and trim all request body */
router.all("*", (req, res, next) => {
  _.forEach(Object.keys(req.body), (eachField) => {
    if (typeof req.body[eachField] === "string") {
      req.body[eachField] = req.body[eachField].trim();
    }
  });
  next();
});

/* GET home page. */
router.get("/api/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to KIGT" });
});

/* WebHook routes */
router.use("/api/webhook", webhookRoutes);

/* location routes */
router.use("/api/location", locationRoutes);

/* user routes */
router.use("/api/user", userRoutes);

/* report routes */
router.use("/api/report", reportRoutes);

/* zendesk routes */
router.use("/api/zendesk", zendeskRoutes);

/* client routes */
router.use("/api/client", clientRoutes);

/* charge station routes */
router.use("/api/chargestation", chargeStationRoutes);

/* merchant routes */
router.use("/api/merchant", merchantRoutes);

export default router;
