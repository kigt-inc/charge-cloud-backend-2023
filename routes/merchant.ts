import express from "express";
import auth from "../middlewares/auth";
import merchantController from "../controllers/merchant";

const router = express.Router();

/* Token Protected Routes */

/* For Create New Merchant */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  merchantController.createMerchant
);
/* For Edit Merchant */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  merchantController.editMerchant
);
/* For Delete Merchant */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  merchantController.deleteMerchant
);
/* For List Merchant */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  merchantController.listMerchants
);
/* For get Merchant by id */
router.get(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  merchantController.getMerchant
);

/* Restricted Routes Only Admin Can Access */

export default router;
