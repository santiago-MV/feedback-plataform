export interface Feedback {
    id: number
    projectId: string
    uderId: string
    rating: number
    comments: string | null
    createdAt: string
}

export type NewFeedback = Omit<Feedback, 'id'>;