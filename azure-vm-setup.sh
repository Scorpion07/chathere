#!/bin/bash

echo "🚀 Setting up ChatHere AI Chatbot on Azure VM..."


# Reload environment
source ~/.bashrc

# 2. Install system dependencies
echo "🔧 Installing system dependencies..."
sudo apt update
sudo apt install -y python3-full python3-pip

# 3. Upgrade pip
echo "📦 Upgrading pip..."
pip3 install --upgrade pip

# 4. Install Python dependencies globally
echo "📦 Installing Python dependencies globally..."
pip3 install --break-system-packages -r requirements-clean.txt

# 5. Build frontend (if Node.js is available)
if command -v npm &> /dev/null; then
    echo "🏗️ Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "⚠️ Node.js not found, skipping frontend build"
fi

# 6. Start the application
echo "🚀 Starting application..."
python3 start-app.py
