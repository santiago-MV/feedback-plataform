export type FeedbackWidgetConfig = {
  projectId: string;
  apiKey: string;
  backendUrl: string;
};

let config: FeedbackWidgetConfig | null = null;

export const FeedbackWidget = {
  init(c: FeedbackWidgetConfig) {
    config = c;
  },
  open() {
    if (!config) throw new Error("FeedbackWidget.init must be called first");
    // TODO: render modal
  }
};
