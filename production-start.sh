#!/bin/bash

echo "🚀 Starting ChatHere in Production Mode..."

# Set environment variables

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
