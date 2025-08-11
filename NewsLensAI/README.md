# NewsLensAI 📰

A comprehensive news analysis and feedback platform that uses AI to analyze sentiment and provide insights on news stories.

## 🌟 Features

- **News Story Management**: Submit and manage news stories with metadata
- **Multi-dimensional Feedback**: Rate stories on accuracy, bias, relevance, and local impact
- **AI-Powered Analysis**: Sentiment analysis of feedback using TextBlob
- **Interactive Dashboard**: Real-time analytics and insights
- **Search & Filtering**: Find stories by category, region, and keywords
- **Responsive Design**: Modern, mobile-friendly interface

## 🚀 Quick Start

### Prerequisites

- Python 3.11 or higher
- `uv` package manager (recommended) or `pip`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd NewsLensAI
   ```

2. **Install dependencies**
   ```bash
   # Using uv (recommended)
   uv sync

   # Or using pip
   pip install -e .
   ```

3. **Run the application**
   ```bash
   uv run python main.py
   ```

4. **Access the application**
   - Open your browser and go to: http://localhost:5000
   - Dashboard: http://localhost:5000/dashboard
   - Submit Story: http://localhost:5000/submit-story

## ⚙️ Environment Configuration

### Default Configuration

The application comes with sensible defaults and will work out of the box:

```python
# Default values in app.py
SESSION_SECRET = "dev-secret-key-change-in-production"
DATABASE_URL = "sqlite:///test.db"
```

### Custom Environment Variables

For production or custom configuration, you can set these environment variables:

#### Windows (PowerShell)
```powershell
$env:SESSION_SECRET="your-secret-key-here"
$env:DATABASE_URL="sqlite:///your-database.db"
uv run python main.py
```

#### Windows (Command Prompt)
```cmd
set SESSION_SECRET=your-secret-key-here
set DATABASE_URL=sqlite:///your-database.db
uv run python main.py
```

#### Linux/macOS
```bash
export SESSION_SECRET="your-secret-key-here"
export DATABASE_URL="sqlite:///your-database.db"
uv run python main.py
```

### Database Options

#### SQLite (Default - Development)
```bash
DATABASE_URL="sqlite:///test.db"
```

#### PostgreSQL (Production)
```bash
DATABASE_URL="postgresql://username:password@localhost/database_name"
```

#### MySQL
```bash
DATABASE_URL="mysql://username:password@localhost/database_name"
```

## 📁 Project Structure

```
NewsLensAI/
├── app.py                 # Main Flask application
├── main.py               # Application entry point
├── models.py             # Database models
├── routes.py             # Flask routes and views
├── ai_analysis.py        # AI sentiment analysis
├── pyproject.toml        # Project dependencies
├── uv.lock              # Locked dependencies
├── static/              # Static assets
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js
│       └── charts.js
└── templates/           # HTML templates
    ├── base.html
    ├── index.html
    ├── dashboard.html
    ├── submit_story.html
    ├── story_detail.html
    ├── feedback_form.html
    ├── 404.html
    └── 500.html
```

## 🗄️ Database Models

### NewsStory
- `id`: Primary key
- `title`: Story title
- `content`: Story content
- `author`: Author name
- `publication`: Publication name
- `category`: Story category
- `region`: Geographic region
- `url`: Story URL (optional)
- `image_url`: Image URL (optional)
- `date_published`: Publication date
- `date_created`: Creation timestamp

### Feedback
- `id`: Primary key
- `story_id`: Foreign key to NewsStory
- `accuracy_rating`: 1-5 rating
- `bias_rating`: 1-5 rating
- `relevance_rating`: 1-5 rating
- `local_impact_rating`: 1-5 rating
- `comment`: Text feedback
- `reviewer_name`: Reviewer name
- `reviewer_email`: Reviewer email
- `reviewer_location`: Reviewer location
- `sentiment_score`: AI sentiment score (-1 to 1)
- `sentiment_label`: Sentiment label (positive/negative/neutral)
- `date_created`: Creation timestamp

## 🤖 AI Features

### Sentiment Analysis
- Uses TextBlob for natural language processing
- Analyzes feedback comments for sentiment
- Provides sentiment scores and labels
- Integrated into feedback submission process

### Analytics Dashboard
- Real-time feedback statistics
- Average ratings by category
- Sentiment distribution charts
- Top performing stories

## 🛠️ Development

### Running in Development Mode
```bash
uv run python main.py
```

### Adding Sample Data
The application includes sample data for testing. To add more sample data:

```python
from app import app, db
from models import NewsStory, Feedback
from ai_analysis import SentimentAnalyzer

# Add sample stories and feedback programmatically
```

### Database Operations
```python
# Create tables
with app.app_context():
    db.create_all()

# Query data
stories = NewsStory.query.all()
feedback = Feedback.query.filter_by(story_id=1).all()
```

## 🚀 Deployment

### Production Setup

1. **Set production environment variables**
   ```bash
   export FLASK_ENV=production
   export SESSION_SECRET="your-secure-secret-key"
   export DATABASE_URL="postgresql://user:pass@host/db"
   ```

2. **Use a production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 main:app
   ```

3. **Set up a reverse proxy (nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY . .

RUN pip install -r requirements.txt

EXPOSE 5000
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
```

## 📊 API Endpoints

### Web Routes
- `GET /` - Homepage with story list
- `GET /dashboard` - Analytics dashboard
- `GET /submit-story` - Story submission form
- `POST /submit-story` - Submit new story
- `GET /story/<id>` - Story detail page
- `GET /story/<id>/feedback` - Feedback form
- `POST /story/<id>/feedback` - Submit feedback

### API Endpoints
- `GET /api/story/<id>/chart-data` - Chart data for story

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Ensure DATABASE_URL is set correctly
   - Check database permissions
   - Verify database server is running

2. **Template Errors**
   - Ensure all template files are present
   - Check Jinja2 syntax in templates
   - Verify template inheritance

3. **Import Errors**
   - Run `uv sync` to install dependencies
   - Check Python version (requires 3.11+)
   - Verify virtual environment is activated

### Debug Mode
```bash
export FLASK_DEBUG=1
uv run python main.py
```

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section
- Review the documentation

---

**NewsLensAI** - Empowering communities through AI-driven news analysis and feedback.
