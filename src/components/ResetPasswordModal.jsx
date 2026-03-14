import React, { useEffect, useState } from "react";
import axios from "axios";

const initialState = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: ""
};

const ResetPasswordModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusKind, setStatusKind] = useState("");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!open) {
      setFormData(initialState);
      setSubmitting(false);
      setStatusMessage("");
      setStatusKind("");
    }
  }, [open]);

  if (!open && !showToast) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage("");
    setStatusKind("");

    if (formData.newPassword !== formData.confirmPassword) {
      setStatusKind("error");
      setStatusMessage("New password and confirm password do not match");
      return;
    }

    try {
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : null;

      if (!user?.username || !user?.role) {
        setStatusKind("error");
        setStatusMessage("Unable to identify the current user");
        return;
      }

      setSubmitting(true);
      const res = await axios.put("http://127.0.0.1:5000/profile/password", {
        username: user.username,
        role: user.role,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });

      setStatusKind("success");
      setStatusMessage(res.data?.message || "Password updated successfully");
      setFormData(initialState);
      setShowToast(true);
      window.setTimeout(() => {
        setShowToast(false);
      }, 2200);
      onClose();
    } catch (error) {
      setStatusKind("error");
      setStatusMessage(error.response?.data?.message || "Unable to update password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {open ? (
        <div className="help-modal-overlay" onClick={onClose} role="presentation">
          <div
            className="help-modal reset-password-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-password-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="reset-password-title">Reset Password</h3>
            <p>Update your account password securely.</p>
            {statusMessage ? (
              <p className={`reset-password-status ${statusKind === "error" ? "error" : "success"}`}>{statusMessage}</p>
            ) : null}
            <form onSubmit={handleSubmit}>
              <label className="help-label" htmlFor="current-password">Current Password</label>
              <input
                id="current-password"
                type="password"
                className="reset-password-input"
                value={formData.currentPassword}
                onChange={(e) => handleChange("currentPassword", e.target.value)}
                required
              />

              <label className="help-label" htmlFor="new-password">New Password</label>
              <input
                id="new-password"
                type="password"
                className="reset-password-input"
                value={formData.newPassword}
                onChange={(e) => handleChange("newPassword", e.target.value)}
                required
              />

              <label className="help-label" htmlFor="confirm-password">Confirm Password</label>
              <input
                id="confirm-password"
                type="password"
                className="reset-password-input"
                value={formData.confirmPassword}
                onChange={(e) => handleChange("confirmPassword", e.target.value)}
                required
              />

              <div className="help-actions">
                <button type="button" className="help-cancel-btn" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="help-send-btn" disabled={submitting}>
                  {submitting ? "Updating..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {showToast ? (
        <div className="concern-toast" role="status" aria-live="polite">
          Password Updated
        </div>
      ) : null}
    </>
  );
};

export default ResetPasswordModal;
