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
        // Fetch real stats from backend
        const response = await fetch('http://20.246.104.157/stats', {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Real stats data:', data);
          
          // Transform backend data to match frontend format
          setStats({
            totalBots: data.models_active || 0,
            activeUsers: data.active_users || 0,
            requestsToday: data.total_requests || 0,
            uptime: `${data.uptime_hours || 0}h`,
            averageLatency: data.average_latency || 0,
          });
          
          // Transform models data for bot display
          if (data.models && data.models.length > 0) {
            const transformedBots = data.models.map((model, index) => ({
              id: index + 1,
              name: model.model,
              type: getModelType(model.model),
              usage: `${Math.round((model.count / data.total_requests) * 100)}%`,
              count: model.count,
              avgLatency: model.avg_latency,
            }));
            setBots(transformedBots);
          }
        } else {
          console.error("Failed to fetch stats:", response.status);
          // Keep existing fallback data
        }
      } catch (err) {
        console.error("Stats fetch failed:", err);
        // Keep existing fallback data
      }
    }

    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Helper function to determine model type
  const getModelType = (modelName) => {
    if (modelName.includes('gemini')) return 'Text + Image';
    if (modelName.includes('gpt')) return 'Text';
    if (modelName.includes('deepseek')) return 'Text + Code';
    if (modelName.includes('claude')) return 'Advanced Text';
    return 'Text';
  };

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
            <h3>Active Models</h3>
            <p>{stats.totalBots}</p>
            <span className="stat-subtitle">AI Models Online</span>
          </div>
          <div className="stat-card glassy">
            <Users size={20} />
            <h3>Unique Users</h3>
            <p>{stats.activeUsers}</p>
            <span className="stat-subtitle">Total Users</span>
          </div>
          <div className="stat-card glassy">
            <Activity size={20} />
            <h3>Total Requests</h3>
            <p>{stats.requestsToday.toLocaleString()}</p>
            <span className="stat-subtitle">All Time</span>
          </div>
          <div className="stat-card glassy">
            <Server size={20} />
            <h3>System Uptime</h3>
            <p>{stats.uptime}</p>
            <span className="stat-subtitle">Hours Running</span>
          </div>
          {stats.averageLatency && (
            <div className="stat-card glassy">
              <Activity size={20} />
              <h3>Avg Latency</h3>
              <p>{stats.averageLatency}s</p>
              <span className="stat-subtitle">Response Time</span>
            </div>
          )}
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
                <div className="bot-header">
                  <h3>{bot.name}</h3>
                  <span className="bot-status online">● Online</span>
                </div>
                <p className="bot-type">{bot.type}</p>
                
                <div className="bot-stats">
                  <div className="stat-row">
                    <span>Requests:</span>
                    <span>{bot.count || 0}</span>
                  </div>
                  <div className="stat-row">
                    <span>Avg Latency:</span>
                    <span>{bot.avgLatency || 0}s</span>
                  </div>
                </div>
                
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
                  <button className="edit-btn" title="Edit Model">
                    <Edit size={14} />
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => removeBot(bot.id)}
                    title="Remove Model"
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
