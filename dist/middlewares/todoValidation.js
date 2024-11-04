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
exports.validateTask = void 0;
const joi_1 = __importDefault(require("joi"));
const validateTask = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const taskDetails = req.body;
    const todoSchema = joi_1.default.object({
        title: joi_1.default.string().required().messages({
            "string.base": "Invalid type, please provdie a valid string",
            "any.required": "Title is required",
            "string.empty": "Title cannot be empty",
        }),
        description: joi_1.default.string().required().messages({
            "string.base": "invalid type,please provde a valid string",
            "any.required": "description is required",
            "string.empty": "description cannot be empty",
        }),
    });
    try {
        yield todoSchema.validateAsync(req.body, { abortEarly: false });
        next();
    }
    catch (error) {
        return res.status(422).json({
            message: "vaidation failed",
            scuesss: false,
        });
    }
});
exports.validateTask = validateTask;
