const STYLE_ID = "feedback-widget-styles";

export function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = cssText();
  document.head.appendChild(style);
}

function cssText(): string {
  return `
/* Overlay */
.fw-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.5);
  padding: 16px;
}

/* Modal */
.fw-modal {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  padding: 16px;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial;
}

.fw-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 12px 0;
}

.fw-label {
  display: block;
  font-size: 14px;
  margin: 0 0 6px 0;
}

.fw-select,
.fw-textarea {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
}

.fw-textarea {
  resize: vertical;
  margin-bottom: 12px;
}

.fw-error {
  color: crimson;
  font-size: 13px;
  margin: 0 0 10px 0;
  display: none;
}

.fw-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.fw-btn {
  padding: 8px 12px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.fw-btn-primary {
  border-color: #111;
  background: #111;
  color: #fff;
}

.fw-btn:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}
`;
}
