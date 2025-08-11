from flask import render_template, request, redirect, url_for, flash, jsonify
from app import app, db
from models import NewsStory, Feedback, StoryCategory
from ai_analysis import SentimentAnalyzer
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

@app.route('/')
def index():
    """Home page with story list and search functionality"""
    search_query = request.args.get('search', '')
    category_filter = request.args.get('category', '')
    region_filter = request.args.get('region', '')
    
    # Base query
    query = NewsStory.query
    
    # Apply filters
    if search_query:
        query = query.filter(
            db.or_(
                NewsStory.title.contains(search_query),
                NewsStory.content.contains(search_query),
                NewsStory.author.contains(search_query)
            )
        )
    
    if category_filter:
        query = query.filter(NewsStory.category == category_filter)
    
    if region_filter:
        query = query.filter(NewsStory.region == region_filter)
    
    # Get stories with pagination
    page = request.args.get('page', 1, type=int)
    stories = query.order_by(NewsStory.date_published.desc()).paginate(
        page=page, per_page=12, error_out=False
    )
    
    # Get filter options
    categories = db.session.query(NewsStory.category).distinct().all()
    regions = db.session.query(NewsStory.region).distinct().all()
    
    return render_template('index.html', 
                         stories=stories, 
                         search_query=search_query,
                         category_filter=category_filter,
                         region_filter=region_filter,
                         categories=[c[0] for c in categories],
                         regions=[r[0] for r in regions])

@app.route('/story/<int:story_id>')
def story_detail(story_id):
    """Story detail page with feedback display"""
    story = NewsStory.query.get_or_404(story_id)
    feedbacks = Feedback.query.filter_by(story_id=story_id).order_by(Feedback.date_created.desc()).all()
    
    # Get AI insights
    insights = SentimentAnalyzer.get_feedback_insights(feedbacks)
    
    return render_template('story_detail.html', story=story, feedbacks=feedbacks, insights=insights)

@app.route('/submit-story', methods=['GET', 'POST'])
def submit_story():
    """Submit a new news story"""
    if request.method == 'POST':
        try:
            story = NewsStory(
                title=request.form['title'],
                content=request.form['content'],
                author=request.form['author'],
                publication=request.form['publication'],
                category=request.form['category'],
                region=request.form['region'],
                url=request.form.get('url', ''),
                image_url=request.form.get('image_url', ''),
                date_published=datetime.strptime(request.form['date_published'], '%Y-%m-%d') if request.form.get('date_published') else datetime.utcnow()
            )
            
            db.session.add(story)
            db.session.commit()
            
            flash('Story submitted successfully!', 'success')
            return redirect(url_for('story_detail', story_id=story.id))
            
        except Exception as e:
            logger.error(f"Error submitting story: {e}")
            flash('Error submitting story. Please try again.', 'error')
            db.session.rollback()
    
    return render_template('submit_story.html')

@app.route('/story/<int:story_id>/feedback', methods=['GET', 'POST'])
def submit_feedback(story_id):
    """Submit feedback for a story"""
    story = NewsStory.query.get_or_404(story_id)
    
    if request.method == 'POST':
        try:
            comment = request.form.get('comment', '')
            
            # Perform sentiment analysis on the comment
            sentiment_score, sentiment_label = SentimentAnalyzer.analyze_sentiment(comment)
            
            feedback = Feedback(
                story_id=story_id,
                accuracy_rating=int(request.form['accuracy_rating']),
                bias_rating=int(request.form['bias_rating']),
                relevance_rating=int(request.form['relevance_rating']),
                local_impact_rating=int(request.form['local_impact_rating']),
                comment=comment,
                reviewer_name=request.form.get('reviewer_name', ''),
                reviewer_email=request.form.get('reviewer_email', ''),
                reviewer_location=request.form.get('reviewer_location', ''),
                sentiment_score=sentiment_score,
                sentiment_label=sentiment_label
            )
            
            db.session.add(feedback)
            db.session.commit()
            
            flash('Thank you for your feedback!', 'success')
            return redirect(url_for('story_detail', story_id=story_id))
            
        except Exception as e:
            logger.error(f"Error submitting feedback: {e}")
            flash('Error submitting feedback. Please try again.', 'error')
            db.session.rollback()
    
    return render_template('feedback_form.html', story=story)

@app.route('/dashboard')
def dashboard():
    """Analytics dashboard for news organizations"""
    # Get overall statistics
    total_stories = NewsStory.query.count()
    total_feedback = Feedback.query.count()
    
    # Get recent stories with feedback counts
    stories_with_feedback = db.session.query(
        NewsStory,
        db.func.count(Feedback.id).label('feedback_count'),
        db.func.avg(Feedback.accuracy_rating).label('avg_accuracy'),
        db.func.avg(Feedback.bias_rating).label('avg_bias'),
        db.func.avg(Feedback.relevance_rating).label('avg_relevance'),
        db.func.avg(Feedback.local_impact_rating).label('avg_local_impact')
    ).outerjoin(Feedback).group_by(NewsStory.id).order_by(NewsStory.date_published.desc()).limit(10).all()
    
    # Category statistics
    category_stats = db.session.query(
        NewsStory.category,
        db.func.count(NewsStory.id).label('story_count'),
        db.func.count(Feedback.id).label('feedback_count')
    ).outerjoin(Feedback).group_by(NewsStory.category).all()
    
    # Region statistics
    region_stats = db.session.query(
        NewsStory.region,
        db.func.count(NewsStory.id).label('story_count'),
        db.func.count(Feedback.id).label('feedback_count')
    ).outerjoin(Feedback).group_by(NewsStory.region).all()
    
    return render_template('dashboard.html',
                         total_stories=total_stories,
                         total_feedback=total_feedback,
                         stories_with_feedback=stories_with_feedback,
                         category_stats=category_stats,
                         region_stats=region_stats)

@app.route('/api/story/<int:story_id>/chart-data')
def story_chart_data(story_id):
    """API endpoint for chart data"""
    story = NewsStory.query.get_or_404(story_id)
    feedbacks = Feedback.query.filter_by(story_id=story_id).all()
    insights = SentimentAnalyzer.get_feedback_insights(feedbacks)
    
    return jsonify({
        'ratings': insights['avg_ratings'],
        'sentiment_distribution': insights['sentiment_distribution'],
        'total_feedback': insights['total_feedback']
    })

@app.errorhandler(404)
def not_found_error(error):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return render_template('500.html'), 500
