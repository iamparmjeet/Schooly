// middleware/pinoLogger.ts
import { randomUUID } from "crypto";
import pino from "pino";
import pinoHttp from "pino-http";
import type { Request, Response, NextFunction } from "express";
import env from "@/env";

export default function pinoLogger() {
  // Create logger once, not per-request
  const logger = pino({
    level: env.LOG_LEVEL || "info",
    ...(env.NODE_ENV !== "production" && {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    }),
  });

  // Create http logger middleware
  const httpLogger = pinoHttp({
    logger,
    genReqId: () => randomUUID(),
    customLogLevel: (_req, res, err) => {
      if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
      if (res.statusCode >= 500 || err) return "error";
      return "info";
    },
  });

  // Return the actual middleware function
  return (req: Request, res: Response, next: NextFunction) => {
    return httpLogger(req, res, next);
  };
}
