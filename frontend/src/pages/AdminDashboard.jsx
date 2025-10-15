import React, { useState, useEffect } from "react";
import {
  Settings,
  Bot,
  BarChart2,
  Plus,
  Trash2,
  Edit,
  RefreshCcw,
  Cpu,
  Users,
  Activity,
  Server,
} from "lucide-react";

export default function AdminDashboard() {
  const [bots, setBots] = useState([]);
  const [newBot, setNewBot] = useState("");
  const [stats, setStats] = useState({
    totalBots: 0,
    activeUsers: 0,
    requestsToday: 0,
    uptime: "0h",
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("http://localhost:5000/admin-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
          if (data.bots) setBots(data.bots);
        } else {
          // fallback demo
          setStats({
            totalBots: 5,
            activeUsers: 1328,
            requestsToday: Math.floor(Math.random() * 12000),
            uptime: "72h",
          });
          setBots([
            { id: 1, name: "Gemini 2.5 Flash", type: "Text + Image", usage: "46%" },
            { id: 2, name: "GPT-4o Mini", type: "Text", usage: "29%" },
            { id: 3, name: "DeepSeek R1", type: "Text + Code", usage: "18%" },
            { id: 4, name: "O-3 Mini", type: "Lightweight Text", usage: "7%" },
          ]);
        }
      } catch (err) {
        console.error("Stats fetch failed:", err);
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 8000);
    return () => clearInterval(interval);
  }, []);

  const addBot = () => {
    if (!newBot.trim()) return;
    const bot = {
      id: Date.now(),
      name: newBot,
      type: "Custom",
      usage: "0%",
    };
    setBots((prev) => [...prev, bot]);
    setNewBot("");
    setStats((s) => ({ ...s, totalBots: s.totalBots + 1 }));
  };

  const removeBot = (id) => {
    setBots(bots.filter((b) => b.id !== id));
    setStats((s) => ({ ...s, totalBots: s.totalBots - 1 }));
  };

  return (
    <div className="admin-wrapper">
      {/* Sidebar */}
      <aside className="sidebar-modern">
        <h2 className="sidebar-logo">🧠 Admin Console</h2>
        <nav>
          <a href="#overview" className="sidebar-item active">
            <BarChart2 size={18} /> Overview
          </a>
          <a href="#bots" className="sidebar-item">
            <Bot size={18} /> Manage Bots
          </a>
          <a href="#settings" className="sidebar-item">
            <Settings size={18} /> Settings
          </a>
        </nav>
      </aside>

      {/* Main Dashboard */}
      <main className="dashboard-main">
        <section id="overview" className="dashboard-header">
          <h1 className="dashboard-title">🚀 System Overview</h1>
          <button className="refresh-btn" onClick={() => window.location.reload()}>
            <RefreshCcw size={16} /> Refresh
          </button>
        </section>

        {/* Stat Cards */}
        <div className="stats-cards">
          <div className="stat-card glassy">
            <Cpu size={20} />
            <h3>Total Bots</h3>
            <p>{stats.totalBots}</p>
          </div>
          <div className="stat-card glassy">
            <Users size={20} />
            <h3>Active Users</h3>
            <p>{stats.activeUsers}</p>
          </div>
          <div className="stat-card glassy">
            <Activity size={20} />
            <h3>Requests Today</h3>
            <p>{stats.requestsToday.toLocaleString()}</p>
          </div>
          <div className="stat-card glassy">
            <Server size={20} />
            <h3>System Uptime</h3>
            <p>{stats.uptime}</p>
          </div>
        </div>

        {/* Bot Management Section */}
        <section id="bots" className="bot-section glassy">
          <h2>🤖 Manage Bots</h2>

          <div className="bot-add">
            <input
              type="text"
              placeholder="Enter new bot name..."
              value={newBot}
              onChange={(e) => setNewBot(e.target.value)}
            />
            <button onClick={addBot} className="btn-add">
              <Plus size={16} /> Add Bot
            </button>
          </div>

          <div className="bot-grid">
            {bots.map((bot) => (
              <div key={bot.id} className="bot-card">
                <h3>{bot.name}</h3>
                <p className="bot-type">{bot.type}</p>
                <div className="bot-usage">
                  <div className="usage-bar">
                    <div
                      className="usage-fill"
                      style={{
                        width: bot.usage,
                        background:
                          "linear-gradient(90deg, #3b82f6, #a855f7)",
                      }}
                    ></div>
                  </div>
                  <span>{bot.usage}</span>
                </div>
                <div className="bot-actions">
                  <button className="edit-btn">
                    <Edit size={14} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => removeBot(bot.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
