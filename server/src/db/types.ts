import {
  Generated,
  Insertable,
  Selectable,
} from 'kysely'

export interface Database {
    feedback: FeedbackTable
}

export interface FeedbackTable {
    id: Generated<number>
    project_id: string
    user_id: string
    rating: number
    comment: string | null
    created_at: string
}

export type NewFeedback = Insertable<FeedbackTable>
export type Feedback = Selectable<FeedbackTable> 