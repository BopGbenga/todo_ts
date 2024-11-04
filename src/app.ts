import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Request, Response } from "express";
import "reflect-metadata";
import { AppDataSource } from "./ormConfig";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("welcome!!");
});
app.get("*", (req: express.Request, res: express.Response) => {
  res.status(404).send("Route does not exist");
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.status(500).json({ message: err.message });
  }
);

import todoRoute from "./routers/todoRouter";
import userRoute from "./routers/userRouter";

app.use("/api/todo", todoRoute);
app.use("/api/user", userRoute);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
