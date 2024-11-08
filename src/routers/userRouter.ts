import { Router } from "express";
import {
  createUser,
  loginUser,
  getUsers,
  updateUsers,
} from "../controllers/user.controllers";
import { validateUser, validateLogin } from "../middlewares/usersValidations";
import limiter from "../helpers/rateLimit";

const router = Router();

router.get("/:id", getUsers);
router.post("/signup", validateUser, limiter, createUser);
router.post("/login", validateLogin, limiter, loginUser);
router.put("/:id", updateUsers);

export default router;
