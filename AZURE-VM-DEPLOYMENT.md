# Azure VM Deployment Guide

## Step 1: Clone Repository
```bash
git clone https://github.com/Scorpion07/chathere.git
cd chathere
```

## Step 2: Set Environment Variables
Replace the placeholders with your actual API keys:

```bash
export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"
export OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"
export DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY_HERE"
export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"
```

## Step 3: Make Environment Variables Persistent
```bash
echo 'export GOOGLE_API_KEY="YOUR_GOOGLE_API_KEY_HERE"' >> ~/.bashrc
echo 'export OPENAI_API_KEY="YOUR_OPENAI_API_KEY_HERE"' >> ~/.bashrc
echo 'export DEEPSEEK_API_KEY="YOUR_DEEPSEEK_API_KEY_HERE"' >> ~/.bashrc
echo 'export ANTHROPIC_API_KEY="YOUR_ANTHROPIC_API_KEY_HERE"' >> ~/.bashrc
```

## Step 4: Reload Environment
```bash
source ~/.bashrc
```

## Step 5: Install Dependencies
```bash
pip install -r requirements-clean.txt
```

## Step 6: Build Frontend
```bash
cd frontend
npm install
npm run build
cd ..
```

## Step 7: Start Application
```bash
gunicorn -c gunicorn.conf.py wsgi:app
```

