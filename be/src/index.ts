import express from "express";
import type { Application, Request, Response } from "express";
import morgan from "morgan";
import env from "./env";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import { pinoLogger } from "./middleware";
import { StatusCode, StatusPhrase } from "./utils";
const port = Number(env.PORT || 5000);

const app: Application = express();
app.use(helmet()); // for security
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Middle to parse
app.use(cookieParser());

if (env.NODE_ENV === "development") {
  // app.use(morgan("combined"));
  app.use(pinoLogger());
}

app.use(
  cors({
    origin: env.NODE_ENV === "development" ? env.LOCAL_APP : env.PROD_APP,
    credentials: true,
  }),
);

app.get("/api/health", (req: Request, res: Response) => {
  res
    .status(StatusCode.OK)
    .json({ status: StatusPhrase.OK, message: "Server is healthy" });
});

app.listen(port, () => {
  console.log(`Server Running on port ${port} : http://localhost:${port} `);
});

// export type { RentlyAPI } from "./app";
