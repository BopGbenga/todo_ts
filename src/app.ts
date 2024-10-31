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

app.use("/", (req: Request, res: Response) => {
  res.send("welcome to Todo");
});

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => console.error("Error connecting to the database", error));

app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
