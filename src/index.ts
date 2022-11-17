import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "@routes/index";
import errorHandler from "@middleware/error.middleware";
import { queryParser } from "express-query-parser";
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// App Configuration
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(queryParser({ parseNumber: true }));

app.get("/", (_req: Request, res: Response) => {
  res.json({ status: "API is running on /v1" });
});
app.use(routes);
app.use(errorHandler);
app.listen(port);
