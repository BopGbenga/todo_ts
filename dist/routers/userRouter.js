"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const usersValidations_1 = require("../middlewares/usersValidations");
const rateLimit_1 = __importDefault(require("../helpers/rateLimit"));
const router = (0, express_1.Router)();
router.post("/signup", usersValidations_1.validateUser, rateLimit_1.default, user_controllers_1.createUser);
router.post("/login", usersValidations_1.validateLogin, rateLimit_1.default, user_controllers_1.loginUser);
exports.default = router;
