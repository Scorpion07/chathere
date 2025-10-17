#!/bin/bash

# Azure VM Deployment Script
# Run this script on your Azure VM

echo "🚀 Starting Azure VM Deployment..."

# Set Environment Variables
echo "📝 Setting up environment variables..."
export GOOGLE_API_KEY="AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk"
export OPENAI_API_KEY="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"
export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"
export ANTHROPIC_API_KEY="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"

# Make environment variables persistent
echo "💾 Making environment variables persistent..."
echo 'export GOOGLE_API_KEY="AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="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"' >> ~/.bashrc
echo 'export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="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"' >> ~/.bashrc

# Reload environment
source ~/.bashrc

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install -r requirements-clean.txt

# Build frontend if Node.js is available
if command -v npm &> /dev/null; then
    echo "🏗️ Building frontend..."
    cd frontend
    npm install
    npm run build
    cd ..
else
    echo "⚠️ Node.js not found, skipping frontend build"
fi

# Start the application
echo "🚀 Starting application with Gunicorn..."
gunicorn -c gunicorn.conf.py wsgi:app
