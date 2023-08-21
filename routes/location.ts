import express from "express";
import auth from "../middlewares/auth";
import locationController from "../controllers/location";

const router = express.Router();

/* Token Protected Routes */

/* For Create New Site Owner */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.createLocation
);
/* For Edit Site Owner */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.editLocation
);
/* For Delete Site Owner */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.deleteLocation
);
/* For List Site Owner */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  locationController.listLocations
);
/* For get Site Owner by id */
router.get(
  "/:id",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  locationController.getLocation
);

/* Restricted Routes Only Admin Can Access */

export default router;
