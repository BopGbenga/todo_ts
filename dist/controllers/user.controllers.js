"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.updateUsers = exports.getUsers = exports.loginUser = exports.createUser = void 0;
const user_1 = __importDefault(require("../entities/user"));
const ormConfig_1 = require("../ormConfig");
const Jwt = __importStar(require("jsonwebtoken"));
const bcrypt_1 = require("bcrypt");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//Register a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { fullname, username, email, password } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(user_1.default);
        //check for existing user
        const existingUser = yield userRepository.findOne({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                message: "User with emai already exist",
            });
            return;
        }
        const newUser = userRepository.create({
            fullname,
            username,
            email,
            password,
        });
        const savedUser = yield userRepository.save(newUser);
        res.status(201).json({
            message: "user created successfully",
            user: savedUser,
        });
    }
    catch (error) {
        console.error("Error creating user", error);
        res.status(500).json({
            message: "something went wrong",
        });
    }
});
exports.createUser = createUser;
//Login user
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userRepository = ormConfig_1.AppDataSource.getRepository(user_1.default);
        const user = yield userRepository.findOne({ where: { email } });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const validPassword = yield (0, bcrypt_1.compare)(password, user.password);
        if (!validPassword) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }
        const token = Jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "2d" });
        res.status(200).json({
            message: "login successful",
            success: true,
            token,
        });
        return;
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
        return;
    }
});
exports.loginUser = loginUser;
///get user profile
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const userRepository = ormConfig_1.AppDataSource.getRepository(user_1.default);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        res.status(200).json({
            message: "User retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error retrieving users:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.getUsers = getUsers;
//update user profile
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = Number(req.params.id);
        const userRepository = ormConfig_1.AppDataSource.getRepository(user_1.default);
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            res.status(404).json({
                message: "User not found",
            });
            return;
        }
        const { fullname, username, email, password } = req.body;
        if (fullname)
            user.fullname = fullname;
        if (username)
            user.username = username;
        if (email)
            user.email = email;
        if (password)
            user.password = password;
        // Save the updated user information
        yield userRepository.save(user);
        res.status(200).json({
            message: "User updated successfully",
            data: user,
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateUsers = updateUsers;
