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
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const PORT = process.env.PORT;
app.use("/", (req, res) => {
    res.send("welcome to Todo");
});
ormConfig_1.AppDataSource.initialize()
    .then(() => {
    console.log("Database connected successfully");
})
    .catch((error) => console.error("Error connecting to the database", error));
app.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});
