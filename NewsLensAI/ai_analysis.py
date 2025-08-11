from textblob import TextBlob
import logging

logger = logging.getLogger(__name__)

class SentimentAnalyzer:
    """AI-powered sentiment analysis for feedback comments"""
    
    @staticmethod
    def analyze_sentiment(text):
        """
        Analyze sentiment of text using TextBlob
        Returns: (score, label) where score is -1 to 1 and label is positive/negative/neutral
        """
        try:
            if not text or not text.strip():
                return 0.0, 'neutral'
            
            blob = TextBlob(text)
            polarity = blob.sentiment.polarity
            
            # Determine sentiment label
            if polarity > 0.1:
                label = 'positive'
            elif polarity < -0.1:
                label = 'negative'
            else:
                label = 'neutral'
            
            logger.debug(f"Sentiment analysis: '{text[:50]}...' -> {polarity:.3f} ({label})")
            return polarity, label
            
        except Exception as e:
            logger.error(f"Error in sentiment analysis: {e}")
            return 0.0, 'neutral'
    
    @staticmethod
    def get_feedback_insights(feedbacks):
        """
        Analyze multiple feedback entries to provide insights
        """
        if not feedbacks:
            return {
                'total_feedback': 0,
                'avg_sentiment': 0.0,
                'sentiment_distribution': {'positive': 0, 'negative': 0, 'neutral': 0},
                'avg_ratings': {'accuracy': 0, 'bias': 0, 'relevance': 0, 'local_impact': 0}
            }
        
        # Calculate averages
        total_count = len(feedbacks)
        sentiment_sum = sum(f.sentiment_score or 0 for f in feedbacks)
        avg_sentiment = sentiment_sum / total_count if total_count > 0 else 0
        
        # Sentiment distribution
        sentiment_dist = {'positive': 0, 'negative': 0, 'neutral': 0}
        for feedback in feedbacks:
            label = feedback.sentiment_label or 'neutral'
            sentiment_dist[label] = sentiment_dist.get(label, 0) + 1
        
        # Average ratings
        avg_ratings = {
            'accuracy': sum(f.accuracy_rating for f in feedbacks) / total_count,
            'bias': sum(f.bias_rating for f in feedbacks) / total_count,
            'relevance': sum(f.relevance_rating for f in feedbacks) / total_count,
            'local_impact': sum(f.local_impact_rating for f in feedbacks) / total_count
        }
        
        return {
            'total_feedback': total_count,
            'avg_sentiment': round(avg_sentiment, 3),
            'sentiment_distribution': sentiment_dist,
            'avg_ratings': {k: round(v, 2) for k, v in avg_ratings.items()}
        }
