import express from "express";
import zendeskController from "../controllers/zendesk";
import auth from "../middlewares/auth";

const router = express.Router();

/* For zendesk ticket creation */
router.post(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  zendeskController.createZendeskTicket
);

router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  zendeskController.getZendeskTicketsByUser
);

/* Restricted Routes Only Admin Can Access */

export default router;
