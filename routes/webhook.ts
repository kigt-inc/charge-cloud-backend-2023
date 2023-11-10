import express from "express";

const router = express.Router();

/* Required Controllers */
import webhookController from "../controllers/webhook";

/* Executor end points */

router.post("/testing", webhookController.testWebhookEvent);
router.post("/", webhookController.createWebHook);

export default router;
