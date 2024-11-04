"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controllers_1 = require("../controllers/user.controllers");
const usersValidations_1 = require("../middlewares/usersValidations");
const router = (0, express_1.Router)();
router.post("/signup", usersValidations_1.validateUser, user_controllers_1.createUser);
router.post("/login", usersValidations_1.validateLogin, user_controllers_1.loginUser);
exports.default = router;
