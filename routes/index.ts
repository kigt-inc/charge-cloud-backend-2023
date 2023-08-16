import express from "express";
let router = express.Router();
import _ from "lodash";
import webhookRoutes from "./webhook";

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

export default router;
