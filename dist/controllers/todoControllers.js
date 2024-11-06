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
exports.deleteTask = exports.updateTodo = exports.getTask = exports.getAllTask = exports.createTask = void 0;
const todo_1 = __importDefault(require("../entities/todo"));
const ormConfig_1 = require("../ormConfig");
//create task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { title, description } = req.body;
        const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ messsage: "user not authenticated" });
            return;
        }
        const newTodo = todoRepository.create({
            title,
            description,
            user: { id: userId },
        });
        const savedTask = yield todoRepository.save(newTodo);
        res
            .status(201)
            .json({ message: "Task created successfully", task: savedTask });
        return;
    }
    catch (error) {
        console.error("error creaing task", error);
        res.status(500).json({ message: "internal server error " });
        return;
    }
});
exports.createTask = createTask;
//Get all task
const getAllTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ message: "unauthorized" });
            return;
        }
        const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
        const task = yield todoRepository.find({ where: { user: { id: userId } } });
        res.status(200).json({
            message: "Task retrived successfully",
            tasks: task,
        });
    }
    catch (error) {
        console.error("error retrieving tasks", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getAllTask = getAllTask;
//Get a task
const getTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const taskId = Number(req.params.id);
        if (!userId) {
            res.status(401).json({ message: "unauthorized" });
            return;
        }
        const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
        const task = yield todoRepository.findOne({
            where: { user: { id: userId }, id: taskId },
        });
        if (!task) {
            res.status(404).json({ message: "Task not found" });
        }
        else {
            res
                .status(200)
                .json({ message: "Task retrieved successfully", todo: task });
        }
    }
    catch (error) {
        console.error("error retrieving tasks", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.getTask = getTask;
//update a task
const updateTodo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const taskId = Number(req.params.id);
        const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
        const task = yield todoRepository.findOne({
            where: { user: { id: userId }, id: taskId },
        });
        if (!task) {
            res.status(404).json({ message: "Task not found or not authorized" });
            return;
        }
        const { title, description, completed } = req.body;
        task.title = title !== null && title !== void 0 ? title : task.title;
        task.description = description !== null && description !== void 0 ? description : task.description;
        task.completed = completed !== null && completed !== void 0 ? completed : task.completed;
        const updatedTask = yield todoRepository.save(task);
        res.status(200).json({
            message: "Task updated scuccessfully",
            task: updatedTask,
        });
    }
    catch (error) {
        console.error("error updating task", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.updateTodo = updateTodo;
//Delete a task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const taskId = Number(req.params.id);
        if (!userId) {
            res.status(401).json({ message: "unauthorized" });
            return;
        }
        const todoRepository = ormConfig_1.AppDataSource.getRepository(todo_1.default);
        const task = yield todoRepository.findOne({
            where: { user: { id: userId }, id: taskId },
        });
        if (!task) {
            res.status(404).json({
                message: "Task not found or you're not authorized to delete this task",
            });
            return;
        }
        yield todoRepository.remove(task);
        res.status(200).json({ message: "Task deleted successfully" });
    }
    catch (error) {
        console.error("error deleting task:", error);
        res.status(500).json({ message: "internal server error" });
    }
});
exports.deleteTask = deleteTask;
