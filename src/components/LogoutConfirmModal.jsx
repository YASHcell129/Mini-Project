import React from "react";

const LogoutConfirmModal = ({ open, onCancel, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="help-modal-overlay" onClick={onCancel} role="presentation">
      <div
        className="help-modal logout-confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="logout-confirm-title">Confirm Logout</h3>
        <p>Are you sure you want to logout?</p>
        <div className="help-actions logout-confirm-actions">
          <button type="button" className="help-cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button type="button" className="help-send-btn logout-confirm-btn" onClick={onConfirm}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;
