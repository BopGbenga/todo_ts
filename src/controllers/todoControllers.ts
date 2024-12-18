import { Request, Response, RequestHandler } from "express";
import Todo from "../entities/todo";
import { TodoDTO } from "../interfaces/todo.dto";
import { AppDataSource } from "../ormConfig";
import { getAll, getOne } from "../helpers/cache";

interface AuthRequest extends Request {
  user?: any;
}
//create task
export const createTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { title, description } = req.body as TodoDTO;

    const todoRepository = AppDataSource.getRepository(Todo);
    const userId = req.user?.id as number;
    if (!userId) {
      res.status(401).json({ messsage: "user not authenticated" });
      return;
    }
    const newTodo = todoRepository.create({
      title,
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
//Get all task
export const getAllTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id; // Get the user ID from the authenticated user
    const allTasks = await getAll(userId);
    res.status(200).json({
      message: "successful",
      data: allTasks,
    });
    return;
  } catch (error) {
    console.error("error retrieving tasks", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//Get a task
export const getTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const taskId = Number(req.params.id);
    const userId = req.user?.id; // Get the user ID from the authenticated user

    if (!userId) {
      // If user ID is not available, return unauthorized
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const task = await getOne(taskId, userId);

    if (!task) {
      // If no task is found, return a 404
      res.status(404).json({ message: "Task not found" });
      return;
    }

    // Return the task data if found
    res.status(200).json({
      message: "Successful",
      data: task,
    });
  } catch (error) {
    console.error("Error retrieving task", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//update a task
export const updateTodo: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;

    const taskId = Number(req.params.id);

    const todoRepository = AppDataSource.getRepository(Todo);
    const task = await todoRepository.findOne({
      where: { user: { id: userId }, id: taskId },
    });
    if (!task) {
      res.status(404).json({ message: "Task not found or not authorized" });
      return;
    }
    const { title, description, completed } = req.body as TodoDTO;
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.completed = completed ?? task.completed;

    const updatedTask = await todoRepository.save(task);
    res.status(200).json({
      message: "Task updated scuccessfully",
      task: updatedTask,
    });
  } catch (error) {
    console.error("error updating task", error);
    res.status(500).json({ message: "internal server error" });
  }
};

//Delete a task
export const deleteTask: RequestHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.id;
    const taskId = Number(req.params.id);
    if (!userId) {
      res.status(401).json({ message: "unauthorized" });
      return;
    }
    const todoRepository = AppDataSource.getRepository(Todo);
    const task = await todoRepository.findOne({
      where: { user: { id: userId }, id: taskId },
    });
    if (!task) {
      res.status(404).json({
        message: "Task not found or you're not authorized to delete this task",
      });
      return;
    }
    await todoRepository.remove(task);
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("error deleting task:", error);
    res.status(500).json({ message: "internal server error" });
  }
};
