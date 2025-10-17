#!/bin/bash

echo "🚀 Starting ChatHere in Production Mode..."

# Set environment variables
export GOOGLE_API_KEY="AIzaSyBAHdj_W0YNIXkRukr1NIOCvQz1t8gqr_o"
export OPENAI_API_KEY="sk-proj-LdhPpUJ1oCJosgXZZ4AKvet-1BmPLbeUs-ezwdAgQ650pRW6z6aLFCwpYnZE-PI4dYQdfUHT7pT3BlbkFJqYfBORjY6MHQX24Qa7yU3iwodhgJ4yFvLYVqv"
export DEEPSEEK_API_KEY="sk-f17076b986ab4849931449f1b78a211e"
export ANTHROPIC_API_KEY="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"

# Kill any existing processes
echo "🔄 Stopping existing processes..."
pkill -f "gunicorn"
pkill -f "python.*app.py"

# Start backend with Gunicorn
echo "🐍 Starting Flask backend with Gunicorn..."
cd /home/azureuser/chathere/backend
nohup gunicorn --bind 127.0.0.1:5000 --workers 4 --timeout 120 app:app > /home/azureuser/chathere/backend.log 2>&1 &

# Wait a moment for backend to start
sleep 3

# Start nginx
echo "🌐 Starting nginx..."
sudo systemctl restart nginx

echo "✅ ChatHere is now running!"
echo "🌍 Frontend: http://your-vm-ip"
echo "🔧 Backend API: http://your-vm-ip/api/"
echo "📊 Check logs: tail -f /home/azureuser/chathere/backend.log"
