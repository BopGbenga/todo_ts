import nodeCache from "node-cache";
import Todo from "../entities/todo";
import { AppDataSource } from "../ormConfig";
import { ReturnDocument } from "typeorm";
const cache = new nodeCache({ stdTTL: 43200, checkperiod: 3600 });

//functioon to get all LGAs

export const getAll = async (userId: number): Promise<any> => {
  const cachedKey = `allTasks${userId}`;
  const cachedTasks: any = cache.get(cachedKey);
  if (cachedTasks) {
    console.log(cachedTasks, "cache hit for all tasks");
    return cachedTasks;
  } else {
    try {
      const todoRepository = AppDataSource.getRepository(Todo);
      const allTasks = await todoRepository.findOne({
        where: { user: { id: userId } }, // Filter by user and task ID
      });
      console.log("cache miss for Tasks");
      if (!allTasks) {
        return ["no task found"];
      } else {
        cache.set(cachedKey, allTasks);
        return allTasks;
      }
    } catch (error) {
      console.error("error fetching all tasks", error);
      throw new Error("Failed to fetch tasks");
    }
  }
};

//get a task
// Function to get a single task by ID
export const getOne = async (taskId: number, userId: number): Promise<any> => {
  const cachedKey = `task_${taskId}`; // Unique cache key for each task
  const cachedTask: any = cache.get(cachedKey);

  if (cachedTask) {
    console.log(cachedTask, "cache hit for task ID:", taskId);
    return cachedTask; // Return cached task
  } else {
    try {
      const todoRepository = AppDataSource.getRepository(Todo);
      const task = await todoRepository.findOne({
        where: { user: { id: userId }, id: taskId }, // Filter by user and task ID
      });
      console.log("cache miss for task ID:", taskId);

      if (!task) {
        return null;
      } else {
        cache.set(cachedKey, task);
        console.log("Task cached:", task); // Log to confirm caching
        return task; // Return the task after caching it
      }
    } catch (error) {
      console.error("Error fetching task", error);
      return null; // Return null if an error occurs
    }
  }
};
