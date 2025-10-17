#!/usr/bin/env python3
"""
Simple startup script for ChatHere AI Chatbot
"""
import sys
import os

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Change to the backend directory
os.chdir(os.path.join(os.path.dirname(__file__), 'backend'))

# Import and run the app
from app import app

if __name__ == "__main__":
    print("🚀 Starting ChatHere AI Chatbot...")
    print("📍 Backend running on: http://0.0.0.0:5000")
    print("🤖 AI Models: Gemini, GPT-4o Mini, GPT-4.1, DeepSeek")
    app.run(host='0.0.0.0', port=5000, debug=False)
