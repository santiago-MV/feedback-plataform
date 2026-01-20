import type { FastifyPluginAsync } from "fastify";
import type { FeedbackDTO } from "../types";
import { newFeedbackRepo, RepoError } from "../repos";
import { newFeedbackService } from "../services";

export const registerFeedbackRoutes: FastifyPluginAsync = async (app) => {
  const repo = newFeedbackRepo(app.db);
  const service = newFeedbackService(repo, {
    nowISO: () => new Date().toISOString(),
  });
  app.post<{ Body: FeedbackDTO }>(
    "/feedback",
    {
      schema: {
        body: {
          type: "object",
          required: ["projectId", "userId", "rating", "timestamp"],
          additionalProperties: false,
          properties: {
            projectId: { type: "string", minLength: 1, maxLength: 100 },
            userId: { type: "string", minLength: 1, maxLength: 100 }, // or uuid format
            rating: { type: "integer", minimum: 1, maximum: 5 },
            comment: { type: "string", maxLength: 1000 },
            timestamp: {
              type: "string",
              format: "date-time", // ISO 8601
            },
          },
        },
        response: {
          201: {
            type: "object",
            properties: { id: { type: "string" } },
            required: ["id"],
          },
        },
      },
    },
    async (request, reply) => {
      const dto = request.body as FeedbackDTO;
      try {
        const result = await service.submitFeedback(dto);

        if (!result.ok) {
          return reply.code(400).send({ error: { code: result.code } });
        }

        return reply.code(201).send({ id: result.id });
      } catch (e) {
        if (e instanceof RepoError) {
          if (e.code === "DB_LOCKED") {
            request.log.warn({ err: e }, "db locked");
            return reply
              .code(503)
              .send({ error: { code: "TEMPORARY_UNAVAILABLE" } });
          }
          if (e.code === "CONSTRAINT_VIOLATION") {
            request.log.warn({ err: e }, "constraint violation");
            return reply.code(409).send({ error: { code: "CONFLICT" } });
          }
          request.log.error({ err: e }, "db error");
          return reply.code(500).send({ error: { code: "INTERNAL" } });
        }

        request.log.error({ err: e }, "unexpected error");
        return reply.code(500).send({ error: { code: "INTERNAL" } });
      }
    },
  );
};
