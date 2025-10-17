#!/bin/bash

echo "🚀 Setting up ChatHere AI Chatbot on Azure VM..."

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

# 2. Create and activate virtual environment
echo "🐍 Creating Python virtual environment..."
python3 -m venv chathere-env
source chathere-env/bin/activate

# 3. Upgrade pip in virtual environment
echo "📦 Upgrading pip..."
pip install --upgrade pip

# 4. Install Python dependencies in virtual environment
echo "📦 Installing Python dependencies..."
pip install -r requirements-clean.txt

# 5. Install system dependencies if needed
echo "🔧 Installing system dependencies..."
sudo apt update
sudo apt install -y python3-full python3-venv

# 6. Build frontend (if Node.js is available)
if command -v npm &> /dev/null; then
    echo "🏗️ Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "⚠️ Node.js not found, skipping frontend build"
fi

# 7. Start the application
echo "🚀 Starting application with Gunicorn..."
gunicorn -c gunicorn.conf.py wsgi:app
