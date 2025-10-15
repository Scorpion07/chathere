import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const { pathname } = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin" },
    { name: "Bots", path: "/admin/bots" },
    { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="sidebar">
      <h2 className="sidebar-title">⚙️ Admin Panel</h2>
      <nav>
        {links.map((l) => (
          <Link
            key={l.path}
            to={l.path}
            className={`sidebar-link ${pathname === l.path ? "active" : ""}`}
          >
            {l.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
