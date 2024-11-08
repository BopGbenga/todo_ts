"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
require("reflect-metadata");
const ormConfig_1 = require("./ormConfig");
const todoRouter_1 = __importDefault(require("./routers/todoRouter"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const PORT = process.env.PORT;
app.get("/", (req, res) => {
    res.status(200).send("welcome!!");
});
app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
});
app.use("/todo", todoRouter_1.default);
app.use("/user", userRouter_1.default);
app.get("*", (req, res) => {
    res.status(404).send("Route does not exist");
});
ormConfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully");
})
    .catch((error) => console.error("Error connecting to the database", error));
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
