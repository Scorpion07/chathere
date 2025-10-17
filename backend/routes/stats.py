# routes/stats.py
from flask import Blueprint, jsonify
import sqlite3, time
from datetime import datetime, timedelta

stats_bp = Blueprint('stats', __name__)
START_TIME = time.time()

def query_db(query, args=(), one=False):
    conn = sqlite3.connect('chatbot.db')
    conn.row_factory = sqlite3.Row
    cur = conn.execute(query, args)
    rows = cur.fetchall()
    conn.close()
    return (rows[0] if rows else None) if one else rows

@stats_bp.route('/stats', methods=['GET'])
def get_stats():
    # ---- Global aggregates ----
    total_chats = query_db("SELECT COUNT(*) AS c FROM chat_logs", one=True)["c"]
    unique_users = query_db("SELECT COUNT(DISTINCT user_id) AS u FROM chat_logs", one=True)["u"]
    avg_latency_row = query_db("SELECT AVG(latency) AS avg FROM chat_logs WHERE latency IS NOT NULL", one=True)
    avg_latency = round(avg_latency_row["avg"], 3) if avg_latency_row["avg"] else 0
    active_models = query_db("SELECT COUNT(DISTINCT model) AS m FROM chat_logs", one=True)["m"]
    uptime = round((time.time() - START_TIME) / 3600, 2)

    # ---- Per-model usage ----
    model_rows = query_db("""
        SELECT model, COUNT(*) AS count, ROUND(AVG(latency),3) AS avg_latency
        FROM chat_logs
        GROUP BY model
        ORDER BY count DESC
    """)
    models = [dict(row) for row in model_rows]

    # ---- Activity trend (last 10 min, per minute) ----
    ten_min_ago = (datetime.utcnow() - timedelta(minutes=10)).isoformat()
    trend_rows = query_db("""
        SELECT strftime('%H:%M', timestamp) AS minute, COUNT(*) AS count, ROUND(AVG(latency),3) AS avg_latency
        FROM chat_logs
        WHERE timestamp >= ?
        GROUP BY minute
        ORDER BY minute ASC
    """, (ten_min_ago,))
    trend = [dict(row) for row in trend_rows]

    return jsonify({
        "active_users": unique_users,
        "total_requests": total_chats,
        "average_latency": avg_latency,
        "models_active": active_models,
        "uptime_hours": uptime,
        "models": models,
        "trend": trend
    })
