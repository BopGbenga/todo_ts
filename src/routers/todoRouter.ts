import { Router } from "express";
import {
  createTask,
  getAllTask,
  getTask,
  updateTodo,
  deleteTask,
} from "../controllers/todoControllers";

import { bearTokenAuth } from "../middlewares/auth";
const router = Router();

router.use(bearTokenAuth);

router.get("/", getAllTask);
router.get("/:id", getTask);
router.post("/", createTask);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTask);

export default router;
