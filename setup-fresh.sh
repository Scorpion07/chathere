#!/bin/bash

echo "🚀 Setting up ChatHere AI Chatbot from scratch..."

# 1. Set Environment Variables
echo "📝 Setting up environment variables..."
export GOOGLE_API_KEY="AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk"
export OPENAI_API_KEY="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"
export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"

# Make environment variables persistent
echo "💾 Making environment variables persistent..."
echo 'export GOOGLE_API_KEY="AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="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"' >> ~/.bashrc
echo 'export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"' >> ~/.bashrc

# Reload environment
source ~/.bashrc

# 2. Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements-clean.txt

# 3. Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Start the application
echo "🚀 Starting application..."
gunicorn -c gunicorn.conf.py wsgi:app
