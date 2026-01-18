export interface WidgetState {
    userId: string;
    projectId: string;
    apiKey: string;
    backendUrl: string;   
}

export interface FeedbackPayload {
    rating: number
    comment: string | null
    timestamp: string
}

export type WidgetInitOptions = {
  projectId: string;
  apiKey: string;
  backendUrl?: string; 
};