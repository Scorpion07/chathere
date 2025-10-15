import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Bot,
  MessageSquare,
  Rocket,
  Settings,
  Shield,
  Zap,
  Activity,
  Server,
  Gauge,
  Clock,
  Users,
} from "lucide-react";

export default function HomePage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch live stats from backend
  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("http://localhost:5000/stats");
        const data = await res.json();
        setStats(data);
        setLoading(false);
      } catch (err) {
        console.error("Stats fetch failed:", err);
        setLoading(false);
      }
    }
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // auto-refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-like-home">
      {/* ===== HERO SECTION ===== */}
      <header className="home-hero glassy-surface">
        <div className="hero-text">
          <h1 className="hero-heading">
            Welcome to <span>ChatVerse AI</span>
          </h1>
          <p className="hero-sub">
            Control your AI ecosystem, manage bots, and view real-time system
            analytics.
          </p>
          <div className="hero-buttons">
            <Link to="/chat" className="btn primary big">
              <Rocket size={18} /> Launch Chat
            </Link>
            <Link to="/admin" className="btn ghost big">
              <Settings size={18} /> Admin Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* ===== LIVE STATS SECTION ===== */}
      <section className="live-stats glassy-surface">
        <h2 className="section-title">Live System Overview</h2>

        {loading ? (
          <div className="loading-text">Fetching live data...</div>
        ) : (
          <div className="stats-cards">
            <StatCard icon={<Users />} label="Active Users" value={stats?.active_users} />
            <StatCard icon={<Server />} label="Total Requests" value={stats?.total_requests.toLocaleString()} />
            <StatCard icon={<Clock />} label="Avg Latency (s)" value={stats?.average_latency} />
            <StatCard icon={<Cpu />} label="Models Active" value={stats?.models_active} />
            <StatCard icon={<Gauge />} label="Uptime (hrs)" value={stats?.uptime_hours} />
          </div>
        )}
      </section>

      {/* ===== MAIN GRID CARDS ===== */}
      <section className="home-grid">
        {[
          {
            icon: <Bot size={28} />,
            title: "Bots Manager",
            desc: "Add, edit, or remove your AI bots and credentials.",
            link: "/admin",
          },
          {
            icon: <MessageSquare size={28} />,
            title: "Chat Interface",
            desc: "Talk with any integrated model instantly.",
            link: "/chat",
          },
          {
            icon: <Activity size={28} />,
            title: "Performance Monitor",
            desc: "Live view of latency, uptime, and API status.",
            link: "/admin",
          },
          {
            icon: <Shield size={28} />,
            title: "Security Controls",
            desc: "Manage API keys, user permissions, and quotas.",
            link: "/settings",
          },
        ].map((card, i) => (
          <Link key={i} to={card.link} className="card glassy-tile">
            <div className="card-icon">{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.desc}</p>
          </Link>
        ))}
      </section>

      {/* ===== CTA ===== */}
      <footer className="home-footer glassy-surface">
        <h2>Ready to deploy your AI platform?</h2>
        <div className="hero-buttons">
          <Link to="/chat" className="btn primary big">
            🚀 Get Started
          </Link>
          <Link to="/admin" className="btn ghost big">
            ⚙️ Manage Bots
          </Link>
        </div>
      </footer>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="stat-box">
      <div className="stat-icon">{icon}</div>
      <div className="stat-info">
        <div className="stat-value">{value ?? "--"}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
}
