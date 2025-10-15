import React, { useState } from "react";
import Sidebar from "../components/sidebar";

export default function BotsManager() {
  const [bots, setBots] = useState([
    { id: 1, name: "Gemini 2.5 Flash", model: "gemini-2.5-flash", status: "active" },
    { id: 2, name: "GPT-4o Mini", model: "gpt-4o-mini", status: "inactive" },
  ]);
  const [newBot, setNewBot] = useState({ name: "", model: "", status: "active" });

  const addBot = () => {
    if (!newBot.name || !newBot.model) return;
    setBots([...bots, { ...newBot, id: Date.now() }]);
    setNewBot({ name: "", model: "", status: "active" });
  };

  const removeBot = (id) => setBots(bots.filter((b) => b.id !== id));

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-main">
        <h1 className="dashboard-title">Manage Bots</h1>

        <div className="bot-form">
          <input
            type="text"
            placeholder="Bot Name"
            value={newBot.name}
            onChange={(e) => setNewBot({ ...newBot, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Model (e.g. gemini-2.5-flash)"
            value={newBot.model}
            onChange={(e) => setNewBot({ ...newBot, model: e.target.value })}
          />
          <select
            value={newBot.status}
            onChange={(e) => setNewBot({ ...newBot, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="dashboard-btn" onClick={addBot}>➕ Add Bot</button>
        </div>

        <table className="bot-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Model</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((bot) => (
              <tr key={bot.id}>
                <td>{bot.name}</td>
                <td>{bot.model}</td>
                <td>{bot.status}</td>
                <td>
                  <button onClick={() => removeBot(bot.id)} className="dashboard-btn">🗑 Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
