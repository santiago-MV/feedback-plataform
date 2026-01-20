import type { FastifyRequest, FastifyReply } from "fastify";

export const auth = async (request: FastifyRequest, reply: FastifyReply) => {
  const apiKey =
    request.headers["x-api-key"] ??
    request.headers.authorization?.replace(/^Bearer\s+/i, "");
  if (apiKey !== process.env.API_KEY) {
    request.log.warn("Unauthorized access attempt");
    return reply.status(401).send({ error: "Unauthorized" });
  }

  return;
};
