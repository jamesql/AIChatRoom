import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import cors from "cors"

// include .env
require('dotenv').config();

const app: Express = express();

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.json());
app.use(cors());

app.use("/api", require("./routers/API"));
app.use("/auth", require("./routers/Auth"));

// port should change later, from env file
app.listen(5000, () => {
  console.log(`[$api] API Server Started.`);
});