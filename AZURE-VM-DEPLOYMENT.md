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

## Your Actual API Keys (for reference):
- Google: AIzaSyDlF5EQw3U7RhjNLxQuEGSWxLy_1_aAAlk
- OpenAI: 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
- DeepSeek: sk-f17076b986ab4849931449f1b78a211e
- Anthropic: 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
