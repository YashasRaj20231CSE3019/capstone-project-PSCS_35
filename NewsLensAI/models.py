from datetime import datetime
from app import db

class NewsStory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    author = db.Column(db.String(100), nullable=False)
    publication = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    region = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(500))
    image_url = db.Column(db.String(500))
    date_published = db.Column(db.DateTime, default=datetime.utcnow)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    feedbacks = db.relationship('Feedback', backref='story', lazy=True, cascade='all, delete-orphan')
    
    def __repr__(self):
        return f'<NewsStory {self.title}>'

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    story_id = db.Column(db.Integer, db.ForeignKey('news_story.id'), nullable=False)
    
    # Multi-dimensional feedback ratings (1-5 scale)
    accuracy_rating = db.Column(db.Integer, nullable=False)
    bias_rating = db.Column(db.Integer, nullable=False)
    relevance_rating = db.Column(db.Integer, nullable=False)
    local_impact_rating = db.Column(db.Integer, nullable=False)
    
    # Text feedback
    comment = db.Column(db.Text)
    
    # Reviewer information
    reviewer_name = db.Column(db.String(100))
    reviewer_email = db.Column(db.String(120))
    reviewer_location = db.Column(db.String(100))
    
    # AI Analysis results
    sentiment_score = db.Column(db.Float)  # -1 to 1
    sentiment_label = db.Column(db.String(20))  # positive, negative, neutral
    
    date_created = db.Column(db.DateTime, default=datetime.utcnow)
    
    def __repr__(self):
        return f'<Feedback {self.id} for Story {self.story_id}>'

class StoryCategory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)
    description = db.Column(db.String(200))
    color = db.Column(db.String(7), default='#007bff')  # Hex color code
    
    def __repr__(self):
        return f'<StoryCategory {self.name}>'
