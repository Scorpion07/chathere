from flask import Flask
from flask_cors import CORS
from routes.chat import chat_bp
import jsonify
import json
import os
from routes.stats import stats_bp
from db.database import init_stats

init_stats()
app = Flask(__name__)
CORS(app)

app.register_blueprint(stats_bp, url_prefix="/stats")
app.register_blueprint(chat_bp)  # ✅ Don’t add url_prefix="/"


def get_models():
    """Return all available models that have valid API keys."""
    cfg_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
    cfg_path = os.path.normpath(cfg_path)
    if not os.path.exists(cfg_path):
        return jsonify({"error": "config.json not found"}), 500

    with open(cfg_path, 'r', encoding='utf-8') as f:
        config = json.load(f)

    valid_models = {
        name: info
        for name, info in config.get('models', {}).items()
        if info.get('api_key') not in [None, "", "null"]
    }

    return jsonify({"available_models": list(valid_models.keys())})

@app.route("/ping")
def ping():
    return {"status": "ok"}, 200

@app.route("/admin-stats")
def admin_stats():
    import random, time
    data = {
        "totalBots": 5,
        "activeUsers": random.randint(1200, 1600),
        "requestsToday": random.randint(8000, 15000),
        "uptime": f"{round(time.time() / 3600, 1)}h",
        "bots": [
            {"id": 1, "name": "Gemini 2.5 Flash", "type": "Text + Image", "usage": "46%"},
            {"id": 2, "name": "GPT-4o Mini", "type": "Text", "usage": "29%"},
            {"id": 3, "name": "DeepSeek R1", "type": "Text + Code", "usage": "18%"},
            {"id": 4, "name": "O-3 Mini", "type": "Lightweight Text", "usage": "7%"},
        ],
    }
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
