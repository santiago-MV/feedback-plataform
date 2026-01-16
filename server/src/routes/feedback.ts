import type { FastifyPluginAsync } from "fastify";

export const registerFeedbackRoutes: FastifyPluginAsync = async (app) => {
    app.post("/feedback", async (request, reply) => {
        console.log("Feedback received:", request.body);
        return reply.status(201).send({ message: "Feedback received" });
    });
};