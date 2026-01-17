import type { FastifyRequest, FastifyReply } from "fastify";

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
    const apiKey = request.headers["x-api-key"] ?? request.headers.authorization?.replace(/^Bearer\s+/i, "");
    if (apiKey !== process.env.API_KEY) {
        request.log.warn("Unauthorized access attempt");
        return reply.status(401).send({ error: "Unauthorized" });
    }

    const body = request.body as { projectId?: string } | undefined;
    const projectId = body?.projectId;

    if (!projectId) {
        request.log.warn("Missing projectId in request body");
        return reply.code(400).send({ error: "Bad Request: missing projectId" });
    }

    if (process.env.PROJECT_ID && projectId !== process.env.PROJECT_ID) {
        request.log.warn({ projectId }, "Unauthorized: wrong projectId");
        return reply.code(403).send({ error: "Forbidden" });
    }

    return;
}; 