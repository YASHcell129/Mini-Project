import React, { useState, useEffect } from "react";
import "../style.css";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showImageOptions, setShowImageOptions] = useState(false);
  const wrapperRef = React.useRef(null);
  const fileInputRef = React.useRef(null);

  // close options when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowImageOptions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // simple SVG silhouette as default
  const defaultImage =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjEyMCIgZmlsbD0iI2RkZCIvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNDAiIHI9IjMwIiBmaWxsPSIjYWFhIi8+CiAgPHBhdGggZD0iTTIwLDEwMCBDMjAsODAgNDAsNjAgNjAsNjAgQzcwLDYwIDEwMCw4MCAxMDAsMTAwIiBmaWxsPSIjYWFhIi8+Cjwvc3ZnPg==";
  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserData(parsed);
      }
    } catch (e) {
      console.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleBack = () => {
    window.history.back();
  };

  if (loading) {
    return (
      <div className="profile-page-container">
        <div className="profile-page-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page-container">
      <button className="profile-close-btn" onClick={handleBack}>
        ×
      </button>

      <div className="profile-page-content">
        <div className="profile-page-header row">
          <h1 className="profile-page-name flex-grow">{userData?.name || "N/A"}</h1>
          <div className="profile-image-wrapper" ref={wrapperRef} onClick={() => setShowImageOptions((s) => !s)}>
            <img
              src={userData?.image || defaultImage}
              alt="Profile"
              className="profile-page-image right"
            />
            {showImageOptions && (
              <div className="image-options-popup">
                <button
                  className="upload-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                >
                  Upload
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="profile-upload-input"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        const result = reader.result;
                        const updated = { ...userData, image: result };
                        setUserData(updated);
                        setShowImageOptions(false);
                        try {
                          const stored = localStorage.getItem("user");
                          if (stored) {
                            const parsed = JSON.parse(stored);
                            parsed.image = result;
                            localStorage.setItem("user", JSON.stringify(parsed));
                          }
                        } catch (err) {}
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                {userData?.image && (
                  <button
                    className="remove-pic-btn small"
                    onClick={(e) => {
                      e.stopPropagation();
                      const updated = { ...userData, image: null };
                      setUserData(updated);
                      setShowImageOptions(false);
                      try {
                        const stored = localStorage.getItem("user");
                        if (stored) {
                          const parsed = JSON.parse(stored);
                          delete parsed.image;
                          localStorage.setItem("user", JSON.stringify(parsed));
                        }
                      } catch (err) {}
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="profile-page-details">
          <div className="profile-detail-card">
            <label>Roll Number</label>
            <p>{userData?.rollno || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <label>Mobile Number</label>
            <p>{userData?.mobno || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <label>Date of Birth</label>
            <p>{userData?.dob || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <label>Username</label>
            <p>{userData?.username || "N/A"}</p>
          </div>

          <div className="profile-detail-card">
            <label>Role</label>
            <p>{userData?.role || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
