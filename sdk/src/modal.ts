import { injectStyles } from "./styles";

type ModalSubmitInput = { rating: number; comment?: string | null };

export function openModal(opts: {
  onSubmit: (data: ModalSubmitInput) => void | Promise<void>;
  onClose?: () => void;
}) {
  injectStyles();

  if (document.querySelector('[data-feedback-widget="overlay"]')) return;

  const overlay = document.createElement("div");
  overlay.className = "fw-overlay";
  overlay.setAttribute("data-feedback-widget", "overlay");

  const modal = document.createElement("div");
  modal.className = "fw-modal";
  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  const title = document.createElement("div");
  title.className = "fw-title";
  title.textContent = "Send feedback";

  const ratingLabel = document.createElement("label");
  ratingLabel.className = "fw-label";
  ratingLabel.textContent = "Rating (1–5)";

  const ratingSelect = document.createElement("select");
  ratingSelect.className = "fw-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Select…";
  placeholder.disabled = true;
  placeholder.selected = true;
  ratingSelect.appendChild(placeholder);

  for (let i = 1; i <= 5; i++) {
    const opt = document.createElement("option");
    opt.value = String(i);
    opt.textContent = String(i);
    ratingSelect.appendChild(opt);
  }

  const commentLabel = document.createElement("label");
  commentLabel.className = "fw-label";
  commentLabel.textContent = "Comment (optional)";

  const comment = document.createElement("textarea");
  comment.className = "fw-textarea";
  comment.rows = 4;
  comment.placeholder = "Tell us more…";

  const error = document.createElement("div");
  error.className = "fw-error";

  const actions = document.createElement("div");
  actions.className = "fw-actions";

  const cancelBtn = document.createElement("button");
  cancelBtn.type = "button";
  cancelBtn.className = "fw-btn";
  cancelBtn.textContent = "Cancel";

  const submitBtn = document.createElement("button");
  submitBtn.type = "button";
  submitBtn.className = "fw-btn fw-btn-primary";
  submitBtn.textContent = "Send";

  const setBusy = (busy: boolean) => {
    submitBtn.disabled = busy;
    cancelBtn.disabled = busy;
    submitBtn.textContent = busy ? "Sending…" : "Send";
  };

  const showError = (msg: string) => {
    error.textContent = msg;
    error.style.display = "block";
  };

  const clearError = () => {
    error.textContent = "";
    error.style.display = "none";
  };

  const doClose = () => {
    document.removeEventListener("keydown", onKeydown);
    overlay.remove();
    opts.onClose?.();
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") doClose();
  };

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) doClose();
  });

  cancelBtn.addEventListener("click", doClose);

  submitBtn.addEventListener("click", async () => {
    clearError();

    const rating = Number(ratingSelect.value);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      showError("Please select a rating from 1 to 5.");
      return;
    }

    setBusy(true);
    try {
      await opts.onSubmit({
        rating,
        comment: comment.value.trim() ? comment.value.trim() : null,
      });
      doClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : "Failed to send feedback.");
      setBusy(false);
    }
  });

  actions.appendChild(cancelBtn);
  actions.appendChild(submitBtn);

  modal.appendChild(title);
  modal.appendChild(ratingLabel);
  modal.appendChild(ratingSelect);
  modal.appendChild(commentLabel);
  modal.appendChild(comment);
  modal.appendChild(error);
  modal.appendChild(actions);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
  document.addEventListener("keydown", onKeydown);
}

export function closeModal() {
  const overlay = document.querySelector('[data-feedback-widget="overlay"]');
  if (overlay) overlay.remove();
}
