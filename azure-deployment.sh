#!/bin/bash

# Azure VM Deployment Script
# Run this script on your Azure VM

echo "🚀 Starting Azure VM Deployment..."

# Set Environment Variables
echo "📝 Setting up environment variables..."
export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
export OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
export DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY_HERE"
export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"

# Make environment variables persistent
echo "💾 Making environment variables persistent..."
echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"' >> ~/.bashrc
echo 'export DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY_HERE"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"' >> ~/.bashrc

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
