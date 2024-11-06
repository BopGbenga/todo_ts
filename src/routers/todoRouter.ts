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

router.post("/", createTask);
router.get("/", getAllTask);
router.get("/:id", getTask);
// router.get("/:taskId", getTask);
router.put("/:id", updateTodo);
router.delete("/:id", deleteTask);

export default router;
