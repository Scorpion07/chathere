import React, { useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../index.css";

// Dummy data for usage stats
const usageData = [
  { day: "Mon", requests: 120 },
  { day: "Tue", requests: 200 },
  { day: "Wed", requests: 150 },
  { day: "Thu", requests: 300 },
  { day: "Fri", requests: 250 },
  { day: "Sat", requests: 180 },
  { day: "Sun", requests: 220 },
];

export default function Admin() {
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    alert(`API Key Saved: ${apiKey}`);
  };

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">🧑‍💻 Admin Dashboard</h1>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card">
          <h2>👥 Users</h2>
          <p className="stat-number">1,245</p>
          <span>Active Users</span>
        </div>
        <div className="stat-card">
          <h2>🤖 Bot Requests</h2>
          <p className="stat-number">8,432</p>
          <span>Total this week</span>
        </div>
        <div className="stat-card">
          <h2>⚡ Avg Response</h2>
          <p className="stat-number">1.2s</p>
          <span>Per request</span>
        </div>
      </div>

      {/* Graph Section */}
      <div className="dashboard-card wide">
        <h2>📊 Bot Usage (Weekly)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={usageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="day" stroke="#aaa" />
            <YAxis stroke="#aaa" />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#60a5fa"
              strokeWidth={3}
              dot={{ r: 4, fill: "#a855f7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Credentials Settings */}
      <div className="dashboard-card">
        <h2>⚙️ Update Bot Credentials</h2>
        <p>Enter your API key to update chatbot connection.</p>
        <input
          type="password"
          placeholder="Enter new API key"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          className="dashboard-input"
        />
        <button onClick={handleSave} className="dashboard-btn">
          Save Key
        </button>
      </div>
    </div>
  );
}
