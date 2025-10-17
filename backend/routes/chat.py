from flask import Blueprint, request, jsonify
import requests, json, traceback, sys, os, sqlite3, time

chat_bp = Blueprint('chat', __name__)

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'chatbot.db')
DB_PATH = os.path.normpath(DB_PATH)

# --- Helper: Ensure table exists ---
def init_chat_log_table():
    conn = sqlite3.connect(DB_PATH)
    conn.execute('''
        CREATE TABLE IF NOT EXISTS chat_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            provider TEXT,
            model TEXT,
            message TEXT,
            reply TEXT,
            latency REAL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

# --- Helper: Log each chat ---
def log_chat(user_id, provider, model, message, reply, latency):
    try:
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            "INSERT INTO chat_logs (user_id, provider, model, message, reply, latency) VALUES (?, ?, ?, ?, ?, ?)",
            (user_id, provider, model, message, reply, latency)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print("⚠️ Logging failed:", e, file=sys.stderr)


# --- Main Chat Route ---
@chat_bp.route('/chat', methods=['POST','GET'])
def chat():
    # ✅ Allow simple GET requests for debugging
    if request.method == 'GET':
        return jsonify({
            "status": "ok",
            "message": "Chat endpoint is live! Use POST to send messages."
        })
    try:
        start_time = time.time()
        data = request.get_json(force=True)
        message = data.get('message', '')
        model = data.get('model', 'gemini-1.5-flash')
        user_id = data.get('user_id', 'guest')

        # --- Load config ---
        cfg_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
        cfg_path = os.path.normpath(cfg_path)
        if not os.path.exists(cfg_path):
            return jsonify({"error": "config.json not found", "path": cfg_path}), 500

        with open(cfg_path, 'r', encoding='utf-8') as f:
            config = json.load(f)

        model_info = config.get('models', {}).get(model)
        if not model_info:
            return jsonify({"error": "unknown model", "model": model}), 400

        provider = model_info.get('provider')
        api_key = model_info.get('api_key')
        endpoint = model_info.get('endpoint')

        # --- Handle null or missing keys ---
        # 🔐 fallback: load API key from environment if not set in config.json
        if not api_key:
            api_key = os.getenv(f"{provider.upper()}_API_KEY")

        

        # === Provider API Calls ===

        # --- 1️⃣ Google Gemini ---
        if provider == 'google':
            resp = requests.post(
                f"{endpoint}?key={api_key}",
                headers={'Content-Type': 'application/json'},
                json={"contents": [{"parts": [{"text": message}]}]},
                timeout=25
            )
            resp.raise_for_status()
            j = resp.json()
            reply = j['candidates'][0]['content']['parts'][0]['text']

        # --- 2️⃣ OpenAI Family (GPT-4o, GPT-4.1, O-3-mini) ---
        elif provider == 'openai':
            resp = requests.post(
                endpoint,
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json'
                },
                json={'model': model, 'messages': [{'role': 'user', 'content': message}]},
                timeout=25
            )
            resp.raise_for_status()
            j = resp.json()
            reply = j['choices'][0]['message']['content']

        # --- 3️⃣ DeepSeek ---
        elif provider == 'deepseek':
            try:
                resp = requests.post(
                    endpoint,
                    headers={
                        'Authorization': f'Bearer {api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={'model': 'deepseek-chat', 'messages': [{'role': 'user', 'content': message}]},
                    timeout=25
                )
                if resp.status_code == 402:
                    return jsonify({"error": "DeepSeek: Payment required or credits exhausted"}), 402

                resp.raise_for_status()
                j = resp.json()
                reply = j['choices'][0]['message']['content']

            except requests.exceptions.ConnectionError:
                return jsonify({"error": "Cannot connect to DeepSeek API"}), 502
            except requests.exceptions.Timeout:
                return jsonify({"error": "DeepSeek API timed out"}), 504


        # --- 4️⃣ Anthropic Claude (3, 3.5) ---
        elif provider == 'anthropic':
            resp = requests.post(
                endpoint,
                headers={
                    'x-api-key': api_key,
                    'Content-Type': 'application/json',
                    'anthropic-version': '2023-06-01'
                },
                json={
                    'model': model,
                    'max_tokens': 1024,
                    'messages': [{'role': 'user', 'content': message}]
                },
                timeout=25
            )
            resp.raise_for_status()
            j = resp.json()
            reply = j.get('content', [{}])[0].get('text', '(No reply)')

        # --- 5️⃣ Grok (X.ai) ---
        elif provider == 'xai':
            resp = requests.post(
                endpoint,
                headers={
                    'Authorization': f'Bearer {api_key}',
                    'Content-Type': 'application/json'
                },
                json={'model': model, 'messages': [{'role': 'user', 'content': message}]},
                timeout=25
            )
            resp.raise_for_status()
            j = resp.json()
            reply = j['choices'][0]['message']['content']

        # --- 6️⃣ SuperBot / UNA (custom) ---
        elif provider == 'superbot':
            resp = requests.post(
                endpoint,
                headers={
                    'x-api-key': api_key,
                    'Content-Type': 'application/json'
                },
                json={'query': message},
                timeout=25
            )
            resp.raise_for_status()
            j = resp.json()
            reply = j.get('response', 'SuperBot: no response received.')

        # --- ❌ Fallback ---
        else:
            return jsonify({"error": "unsupported provider", "provider": provider}), 400

        latency = round(time.time() - start_time, 3)
        log_chat(user_id, provider, model, message, reply, latency)

        return jsonify({"reply": reply, "latency": latency})

    except requests.HTTPError as http_err:
        tb = traceback.format_exc()
        print(tb, file=sys.stderr)
        try:
            err_text = http_err.response.text
        except Exception:
            err_text = str(http_err)
        return jsonify({"error": "upstream HTTP error", "detail": err_text}), 502

    except Exception as e:
        tb = traceback.format_exc()
        print(tb, file=sys.stderr)
        return jsonify({
            "error": "internal server error",
            "detail": str(e),
            "trace": tb.splitlines()[-5:]
        }), 500


# --- Initialize DB ---
init_chat_log_table()
