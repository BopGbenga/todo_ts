import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import "reflect-metadata";
import { AppDataSource } from "./ormConfig";
import todoRoute from "./routers/todoRouter";
import userRoute from "./routers/userRouter";

dotenv.config();

const app = express();

app.use(bodyParser.json());

const PORT = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("welcome!!");
});

app.use((req: Request, res: Response, next: NextFunction) => {
  const err = new Error("Not Found");
  (err as any).status = 404;
  next(err);
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

app.use("/todo", todoRoute);
app.use("/user", userRoute);

app.get("*", (req: express.Request, res: express.Response) => {
  res.status(404).send("Route does not exist");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Entities Loaded:", AppDataSource.options.entities);
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
