#!/bin/bash

echo "🚀 Deploying ChatHere to Azure VM..."

# 1. Update system and install nginx
echo "📦 Installing nginx..."
sudo apt update
sudo apt install -y nginx python3-full python3-pip nodejs npm

# 2. Install Python dependencies
echo "🐍 Installing Python dependencies..."
pip3 install --break-system-packages -r requirements-clean.txt

# 3. Build frontend
echo "🏗️ Building frontend..."
cd frontend
npm install
npm run build
cd ..

# 4. Configure nginx
echo "🌐 Configuring nginx..."
sudo cp nginx.conf /etc/nginx/sites-available/chathere
sudo ln -sf /etc/nginx/sites-available/chathere /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t

# 5. Set up systemd service for auto-start
echo "⚙️ Setting up systemd service..."
sudo tee /etc/systemd/system/chathere.service > /dev/null <<EOF
[Unit]
Description=ChatHere AI Chatbot
After=network.target

[Service]
Type=simple
User=azureuser
WorkingDirectory=/home/azureuser/chathere
ExecStart=/bin/bash /home/azureuser/chathere/production-start.sh
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 6. Enable services
echo "🔄 Enabling services..."
sudo systemctl daemon-reload
sudo systemctl enable chathere
sudo systemctl enable nginx

# 7. Start services
echo "🚀 Starting services..."
sudo systemctl start chathere
sudo systemctl start nginx

echo "✅ Deployment complete!"
echo "🌍 Your app should be available at: http://$(curl -s ifconfig.me)"
echo "📊 Check status: sudo systemctl status chathere"
echo "📝 View logs: journalctl -u chathere -f"
