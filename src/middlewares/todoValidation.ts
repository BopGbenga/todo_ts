import { Request, Response, NextFunction } from "express";
import joi from "joi";
import { TodoDTO } from "../interfaces/todo.dto";

export const validateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const taskDetails: TodoDTO = req.body;
  const todoSchema = joi.object<TodoDTO>({
    title: joi.string().required().messages({
      "string.base": "Invalid type, please provdie a valid string",
      "any.required": "Title is required",
      "string.empty": "Title cannot be empty",
    }),

    description: joi.string().required().messages({
      "string.base": "invalid type,please provde a valid string",
      "any.required": "description is required",
      "string.empty": "description cannot be empty",
    }),
  });
  try {
    await todoSchema.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    return res.status(422).json({
      message: "vaidation failed",
      scuesss: false,
    });
  }
};
