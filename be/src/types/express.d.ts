// @/types/express.d.ts
import type { Environment } from "@/env";

declare global {
  namespace Express {
    interface Request {
      env: Environment;
    }
  }
}

export {};
