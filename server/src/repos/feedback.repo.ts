import { Kysely } from 'kysely';
import type { FeedbackRepo, NewFeedback } from '../types';
import { Database } from '../db/types';
import { mapDbError } from './errors';
import crypto from 'node:crypto';

const createFeedback = async (db: Kysely<Database>, feedback: NewFeedback) => {
    const id = crypto.randomUUID();
    try {
        await db
        .insertInto("feedback")
        .values({
            id,
            project_id: feedback.projectId,
            user_id: feedback.userId,
            rating: feedback.rating,
            comment: feedback.comment,
            created_at: feedback.timestamp,
            saved_at: new Date().toISOString(),
        })
        .executeTakeFirstOrThrow();

        return id;
    } catch (err) {
        throw mapDbError(err);
    }
}

export const newFeedbackRepo: (db: Kysely<Database>) => FeedbackRepo = (db: Kysely<Database>) => {
    return {
        create: (feedback: NewFeedback) => createFeedback(db, feedback),
    }
}