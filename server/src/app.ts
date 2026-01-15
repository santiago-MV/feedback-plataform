import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
// import { registerAuth } from "./plugins/auth.js";
import { registerHealthRoutes } from "./routes/health";
// import { registerFeedbackRoutes } from "./routes/feedback.js";

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  // Auth hook (API key)
  // app.register(registerAuth);

  // Routes
  app.register(registerHealthRoutes);
  // app.register(registerFeedbackRoutes);

  return app;
}
