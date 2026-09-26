import { Router } from "express";
import { validate } from "../middlewares/validate.middleware.js";
import { LoginSchema, RegisterSchema } from "../validators/auth.validator.js";
import { loginController, logoutController, meController, registerController } from "../controllers/auth.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", validate(RegisterSchema, "body") , registerController);
router.post("/login", validate(LoginSchema, "body"), loginController);
router.post("/login", logoutController);
router.get("/me", authentication, meController);

export default router;