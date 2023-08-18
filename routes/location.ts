import express from "express";
// import adminAuth from "../middleware/adminAuth";
import locationController from "../controllers/location";

const router = express.Router();

/* Token Protected Routes */

/* For Create New Site Owner */
router.post(
  "/",
//   [adminAuth.verifyToken, adminAuth.isAdmin],
  locationController.createLocation
);
/* For Edit Site Owner */
router.put(
  "/:id",
//   [adminAuth.verifyToken, adminAuth.isAdmin],
  locationController.editLocation
);
/* For Delete Site Owner */
router.delete(
  "/:id",
//   [adminAuth.verifyToken, adminAuth.isAdmin],
  locationController.deleteLocation
);
/* For List Site Owner */
router.get(
  "/",
//   [adminAuth.verifyToken, adminAuth.isAdminOrUser],
  locationController.listLocations
);
/* For get Site Owner by id */
router.get(
  "/:id",
//   [adminAuth.verifyToken, adminAuth.isAdminOrUser],
  locationController.getLocation
);

/* Restricted Routes Only Admin Can Access */

export default router;
