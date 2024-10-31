import { Request, Response, RequestHandler } from "express";
import User from "../entities/user";
import { AppDataSource } from "../ormConfig";
import * as Jwt from "jsonwebtoken";
import { CreateUserDTO, LoginUserDTO } from "../interfaces/users.dto";
import { compare } from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

//Register a new user
const createUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { fullname, username, email, password } = req.body as CreateUserDTO;
    //check for existing user
    const userRepository = AppDataSource.getRepository(User);
    const existingUser = await userRepository.findOne({ where: { email } });
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
    const savedUser = await userRepository.save(newUser);

    res.status(201).json({
      message: "user created successfully",
      user: savedUser,
    });
  } catch (error) {
    console.error("Error creating user", error);
    res.status(500).json({
      message: "something went wrong",
    });
  }
};

//Login user
const loginUser: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginUserDTO;
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const validPassword = await compare(password, user.password);
    if (!validPassword) {
      res.status(401).json({ message: "Invalid password" });
      return;
    }

    const token = Jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    );

    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
    return;
  }
};

export default { createUser, loginUser };
