@echo off
echo 🚀 Setting up ChatHere AI Chatbot from scratch...

REM 1. Set Environment Variables
echo 📝 Setting up environment variables...
set GOOGLE_API_KEY=AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk
set OPENAI_API_KEY=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
set DEEPSEEK_API_KEY=sk-f17076b986ab4849931449f1b78a211e

REM 2. Install Python dependencies
echo 📦 Installing Python dependencies...
pip install -r requirements-clean.txt

REM 3. Build frontend
echo 🏗️ Building frontend...
cd frontend
npm install
npm run build
cd ..

REM 4. Start the application
echo 🚀 Starting application...
python backend/app.py
