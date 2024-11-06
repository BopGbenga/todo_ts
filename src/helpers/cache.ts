import nodeCache from "node-cache";
import Todo from "../entities/todo";
import { AppDataSource } from "../ormConfig";
import { ReturnDocument } from "typeorm";
const cache = new nodeCache({ stdTTL: 43200, checkperiod: 3600 });

//functioon to get all LGAs

export const getAll = async (): Promise<any> => {
  const cachedKey = "allTasks";
  const cachedTasks: any = cache.get(cachedKey);
  if (cachedTasks) {
    console.log(cachedTasks, "cache hit for all tasks");
    return;
  } else {
    try {
      const todoRepository = AppDataSource.getRepository(Todo);
      const allTasks = await todoRepository.find();
      console.log("cache miss for Tasks");
      if (allTasks.length === 0) {
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
export const getOne = async (taskId: number): Promise<any> => {
  const cachedKey = `task_${taskId}`; // Unique cache key for each task
  const cachedTask: any = cache.get(cachedKey);

  if (cachedTask) {
    console.log(cachedTask, "cache hit for task ID:", taskId);
    return cachedTask; // Return cached task
  } else {
    try {
      const todoRepository = AppDataSource.getRepository(Todo);
      const task = await todoRepository.findOne({ where: { id: taskId } });

      console.log("cache miss for task ID:", taskId);

      if (!task) {
        return { message: "Task not found" }; // Handle case where task does not exist
      } else {
        cache.set(cachedKey, task); // Store the fetched task in cache
        return task; // Return the fetched task
      }
    } catch (error) {
      console.error("error fetching task", error);
      throw new Error("Failed to fetch task"); // Handle the error appropriately
    }
  }
};
