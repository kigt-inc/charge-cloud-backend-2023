import express from "express";
import auth from "../middlewares/auth";
import locationController from "../controllers/location";

const router = express.Router();

/* Token Protected Routes */

/* For Create New Location */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.createLocation
);
/* For Edit Location */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.editLocation
);
/* For Delete Location */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  locationController.deleteLocation
);
/* For List Location */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  locationController.listLocations
);
/* For get Location by id */
router.get(
  "/:id",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  locationController.getLocation
);

/* Restricted Routes Only Admin Can Access */

export default router;
