import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function Settings() {
  const [profile, setProfile] = useState({ name: "Admin", email: "admin@bot.com", theme: "light" });

  const handleSave = () => alert("✅ Settings saved successfully!");

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="dashboard-title">Profile Settings</h1>

        <div className="settings-form">
          <label>
            Name:
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </label>

          <label>
            Theme:
            <select
              value={profile.theme}
              onChange={(e) => setProfile({ ...profile, theme: e.target.value })}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </label>

          <button className="dashboard-btn" onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </main>
    </div>
  );
}
