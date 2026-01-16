import { db } from '../db';
import type { NewFeedback } from '../types';

const createFeedback = async (feedback: NewFeedback) => {
    const [id] = await db
        .insertInto('feedback')
        .values({
            project_id: feedback.projectId,
            user_id: feedback.uderId,
            rating: feedback.rating,
            comment: feedback.comments,
            created_at: feedback.createdAt,
        })
        .returning('id')
        .execute();

    return id;
}