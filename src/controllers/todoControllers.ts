import { Request, Response, RequestHandler } from "express";
import Todo from "../entities/todo";
import { TodoDTO } from "../interfaces/todo.dto";
import { AppDataSource } from "../ormConfig";
import { promises } from "dns";
import { json } from "body-parser";

interface AuthRequest extends Request {
  user?: any;
}
//create task
export const createTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { task, description } = req.body as TodoDTO;
    const todoRepository = AppDataSource.getRepository(Todo);
    const userId = req.user?.id as number;
    if (!userId) {
      res.status(401).json({ messsage: "user not authenticated" });
      return;
    }
    const newTodo = todoRepository.create({
      task,
      description,
      user: { id: userId },
    });
    const savedTask = await todoRepository.save(newTodo);
    res
      .status(201)
      .json({ message: "Task created successfully", task: savedTask });
    return;
  } catch (error) {
    console.error("error creaing task", error);
    res.status(500).json({ message: "internal server error " });
    return;
  }
};
//Get all todo
export const getAllTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const task = await todoRepository.find({ where: { user: { id: userId } } });
    res.status(200).json({
      message: "Task retrived successfully",
      tasks: task,
    });
  } catch (error) {
    console.error("error retrieving tasks", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//Get a todo
export const getTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.taskId);
    if (!userId) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const task = await todoRepository.findOne({
      where: { user: { id: userId }, id: taskId },
    });
    if (!task) {
      res.status(200).json({ message: "task not found" });
    } else {
      res
        .status(200)
        .json({ message: "Task retrieved successfully", todo: task });
    }
  } catch (error) {
    console.error("error retrieving tasks", error);
    res.status(500).json({ message: "internal server error" });
  }
};
