import express from "express";
import {
  createMeeting,
  joinMeeting,
} from "../../controllers/meeting/meeting.controller.js";
import { authenticate } from "../../middleware/auth/auth.middleware.js";
import { joinMeetingSchema } from "../../validators/meeting/meeting.validator.js";

const router = express.Router();

router.post("/", authenticate, createMeeting);

router.post(
  "/join",
  authenticate,
  (req, res, next) => {
    const result = joinMeetingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors,
      });
    }

    req.body = result.data;
    next();
  },
  joinMeeting
);

export default router;