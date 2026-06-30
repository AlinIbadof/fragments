import express from "express";
import {
  accessEvent,
  createEvent,
  getCurrentEvent,
} from "../controllers/event-controller.ts";
import { requireEventAccess } from "../middleware/require-event-access.ts";
import { validateCreateEvent } from "../middleware/validate-create-event.ts";
import { validateEventAccess } from "../middleware/validate-event-access.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Event route works",
  });
});

router.post("/", validateCreateEvent, createEvent);

router.post("/access", validateEventAccess, accessEvent);

router.get("/current", requireEventAccess, getCurrentEvent);

export default router;
