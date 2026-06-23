import express from "express";
import { createEvent } from "../controllers/event-controller.ts";
import { validateCreateEvent } from "../middleware/validate-create-event.ts";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "Event route works",
  });
});

router.post("/", validateCreateEvent, createEvent);

export default router;
