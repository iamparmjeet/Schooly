import type { ErrorRequestHandler } from "express";
import { StatusCode } from "@/utils";
import env from "@/env";

const onError: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode =
    typeof err.status === "number" && err.status !== StatusCode.OK
      ? err.status
      : StatusCode.INTERNAL_SERVER_ERROR;
  const environment = env.NODE_ENV || env.NODE_ENV;
  res.status(statusCode).json({
    message: err.message,
    stack: environment === "production" ? undefined : err.stack,
  });
};

export default onError;
