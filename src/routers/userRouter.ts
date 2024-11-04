import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controllers";
import { validateUser, validateLogin } from "../middlewares/usersValidations";

const router = Router();

router.post("/signup", validateUser, createUser);
router.post("/login", validateLogin, loginUser);

export default router;
