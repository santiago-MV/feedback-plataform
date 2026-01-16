import Fastify, { type FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import { registerHealthRoutes, registerFeedbackRoutes } from "./routes";
import { auth } from "./hooks";
import { dbPlugin } from "./plugins";


export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: true });

  app.register(cors, { origin: true });

  // Plugins
  app.register(dbPlugin);

  // Routes
  app.register(registerHealthRoutes);
  app.register( async (app) => {
    app.addHook("preHandler", auth);
    app.register(registerFeedbackRoutes);
  });
  return app;
}
