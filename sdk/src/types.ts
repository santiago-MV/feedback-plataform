export interface WidgetState {
  userId: string;
  projectId: string;
  apiKey: string;
  backendUrl: string;
}

export interface FeedbackPayload {
  rating: number;
  timestamp: string;
  comment?: string;
}

export type WidgetInitOptions = {
  projectId: string;
  apiKey: string;
  backendUrl?: string;
};
