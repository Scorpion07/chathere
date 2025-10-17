#!/bin/bash

echo "🚀 Setting up ChatHere AI Chatbot on Azure VM..."

# 1. Set Environment Variables
echo "📝 Setting up environment variables..."
export GOOGLE_API_KEY="AIzaSyBAHdj_W0YNIXkRukr1NIOCvQz1t8gqr_o"
export OPENAI_API_KEY="sk-proj-LdhPpUJ1oCJosgXZZ4AKvet-1BmPLbeUs-ezwdAgQ650pRW6z6aLFCwpYnZE-PI4dYQdfUHT7pT3BlbkFJqYfBORjY6MHQX24Qa7yU3iwodhgJ4yFvLYVqv"
export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"
export ANTHROPIC_API_KEY="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"

# Make environment variables persistent
echo "💾 Making environment variables persistent..."
echo 'export GOOGLE_API_KEY="AIzaSyBAHdj_W0YNIXkRukr1NIOCvQz1t8gqr_o"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="sk-proj-LdhPpUJ1oCJosgXZZ4AKvet-1BmPLbeUs-ezwdAgQ650pRW6z6aLFCwpYnZE-PI4dYQdfUHT7pT3BlbkFJqYfBORjY6MHQX24Qa7yU3iwodhgJ4yFvLYVqv"' >> ~/.bashrc
echo 'export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="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"' >> ~/.bashrc

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
