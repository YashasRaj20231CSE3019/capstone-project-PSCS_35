# 🚀 NewsLensAI Quick Start Guide

Get NewsLensAI running in under 5 minutes!

## ⚡ Super Quick Start

### 1. Install Dependencies
```bash
# Using uv (recommended)
uv sync

# OR using pip
pip install -r requirements.txt
```

### 2. Run the Application
```bash
uv run python main.py
```

### 3. Open Your Browser
- Go to: http://localhost:5000
- That's it! 🎉

## 📋 What You Get

✅ **Working application** with sample data
✅ **Dashboard** with analytics
✅ **Story submission** form
✅ **Feedback system** with AI analysis
✅ **Search and filtering** capabilities

## 🔧 Environment Variables (Optional)

The app works out of the box, but you can customize:

```bash
# Windows PowerShell
$env:SESSION_SECRET="your-secret-key"
$env:DATABASE_URL="sqlite:///your-db.db"

# Linux/macOS
export SESSION_SECRET="your-secret-key"
export DATABASE_URL="sqlite:///your-db.db"
```

## 🌐 Application URLs

- **Homepage**: http://localhost:5000
- **Dashboard**: http://localhost:5000/dashboard
- **Submit Story**: http://localhost:5000/submit-story
- **Sample Story**: http://localhost:5000/story/1

## 🛠️ Troubleshooting

**"Module not found" error?**
```bash
uv sync
```

**Database error?**
```bash
# The app creates the database automatically
# Just restart: uv run python main.py
```

**Port 5000 in use?**
```bash
# Change port in main.py or kill the process using port 5000
```

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Check out the [API endpoints](README.md#api-endpoints)
- Learn about [deployment options](README.md#deployment)

---

**Need help?** Check the [troubleshooting section](README.md#troubleshooting) in the main README.
