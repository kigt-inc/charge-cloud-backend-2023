import express from "express";
import auth from "../middlewares/auth";
import chargeStationController from "../controllers/chargeStation";

const router = express.Router();

/* Token Protected Routes */

/* For Create New ChargeStation */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  chargeStationController.createChargeStation
);
/* For Edit ChargeStation */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  chargeStationController.editChargeStation
);
/* For Delete ChargeStation */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  chargeStationController.deleteChargeStation
);
/* For List ChargeStation */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  chargeStationController.listChargeStations
);
/* For get ChargeStation by id */
router.get(
  "/:id",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  chargeStationController.getChargeStation
);

/* Restricted Routes Only Admin Can Access */

export default router;
