import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controllers";
import { validateUser, validateLogin } from "../middlewares/usersValidations";
import limiter from "../helpers/rateLimit";

const router = Router();

router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);

export default router;
