import express from "express";
import auth from "../middlewares/auth";
import clientController from "../controllers/client";

const router = express.Router();

/* Token Protected Routes */

/* For Create New Client */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  clientController.createClient
);
/* For Edit Client */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  clientController.editClient
);
/* For Delete Client */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  clientController.deleteClient
);
/* For List Client */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdmin],
  clientController.listClients
);
/* For get Client by id */
router.get(
  "/:id",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  clientController.getClient
);

/* Restricted Routes Only Admin Can Access */

export default router;
