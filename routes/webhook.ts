import express from "express";

const router = express.Router();

/* Required Controllers */
import webhookController from "../controllers/webhook";

/* Executor end points */

router.get("/", webhookController.getWebhookEvent);
router.post("/", webhookController.createWebHook);

export default router;
