"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOne = exports.getAll = void 0;
const node_cache_1 = __importDefault(require("node-cache"));
const todo_1 = __importDefault(require("../entities/todo"));
const ormConfig_1 = require("../ormConfig");
const cache = new node_cache_1.default({ stdTTL: 43200, checkperiod: 3600 });
//functioon to get all LGAs
const getAll = () => __awaiter(void 0, void 0, void 0, function* () {
    const cachedKey = "allTasks";
    const cachedTasks = cache.get(cachedKey);
    if (cachedTasks) {
        console.log(cachedTasks, "cache hit for all tasks");
        return;
    }
    else {
        try {
            const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
            const allTasks = yield todoRepository.find();
            console.log("cache miss for Tasks");
            if (allTasks.length === 0) {
                return ["no task found"];
            }
            else {
                cache.set(cachedKey, allTasks);
                return allTasks;
            }
        }
        catch (error) {
            console.error("error fetching all tasks", error);
            throw new Error("Failed to fetch tasks");
        }
    }
});
exports.getAll = getAll;
//get a task
// Function to get a single task by ID
const getOne = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedKey = `task_${taskId}`; // Unique cache key for each task
    const cachedTask = cache.get(cachedKey);
    if (cachedTask) {
        console.log(cachedTask, "cache hit for task ID:", taskId);
        return cachedTask; // Return cached task
    }
    else {
        try {
            const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
            const task = yield todoRepository.findOne({ where: { id: taskId } });
            console.log("cache miss for task ID:", taskId);
            if (!task) {
                return { message: "Task not found" }; // Handle case where task does not exist
            }
            else {
                cache.set(cachedKey, task); // Store the fetched task in cache
                return task; // Return the fetched task
            }
        }
        catch (error) {
            console.error("error fetching task", error);
            throw new Error("Failed to fetch task"); // Handle the error appropriately
        }
    }
});
exports.getOne = getOne;
