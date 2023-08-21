import express from "express";
import auth from "../middlewares/auth";
import reportController from "../controllers/report";

const router = express.Router();

/* Token Protected Routes */

/* For get energy utilization report */
router.get(
  "/energy-utilization",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  reportController.energyUtilizationReport
);
/* For get revenue per day report */
router.get(
  "/generated-revenue",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  reportController.generatedRevenueReport
);
/* For get charges/transactions vs time */
router.get(
  "/charges-transaction",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  reportController.energyUtilizationReport
);

export default router;
