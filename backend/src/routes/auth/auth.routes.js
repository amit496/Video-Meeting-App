import { Router } from "express";
import { register, login, me } from "../../controllers/auth/auth.controller.js";
import {
  registerSchema,
  loginSchema,
} from "../../validators/auth/auth.validator.js";
import { authenticate } from "../../middleware/auth/auth.middleware.js";

const router = Router();

const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;
  next();
};

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authenticate, me);


export default router;