# backend/db/database.py

import sqlite3
from datetime import datetime

def get_db_connection():
    conn = sqlite3.connect('chatbot.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_stats():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            model TEXT,
            message TEXT,
            reply TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            latency REAL
        )
    ''')
    conn.commit()
    conn.close()
