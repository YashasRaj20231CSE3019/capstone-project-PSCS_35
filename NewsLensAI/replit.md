# 360° News Feedback Platform

## Overview

The 360° News Feedback Platform is a Flask-based web application designed to collect and analyze community feedback on news stories. The platform enables users to submit news articles, provide multi-dimensional ratings (accuracy, bias, relevance, local impact), and leverages AI-powered sentiment analysis to generate insights. The system focuses on regional news coverage and provides comprehensive analytics through an interactive dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Backend Architecture
- **Framework**: Flask web framework with SQLAlchemy ORM for database operations
- **Database**: Configured to use PostgreSQL via environment variable `DATABASE_URL` with connection pooling and health checks
- **Models**: Three main entities - NewsStory, Feedback, and StoryCategory with proper relationships and foreign key constraints
- **AI Integration**: TextBlob-based sentiment analysis for automatic processing of feedback comments

### Frontend Architecture
- **Template Engine**: Jinja2 templating with modular template inheritance using base.html
- **CSS Framework**: Bootstrap 5 for responsive design and UI components
- **JavaScript Libraries**: Chart.js for data visualization, Font Awesome for icons
- **Static Assets**: Organized CSS and JavaScript files for custom styling and interactive features

### Database Schema
- **NewsStory**: Stores article metadata including title, content, author, publication, category, region, and timestamps
- **Feedback**: Multi-dimensional rating system (1-5 scale) for accuracy, bias, relevance, and local impact, plus text comments and reviewer information
- **AI Analysis Fields**: Sentiment score (-1 to 1) and sentiment labels (positive/negative/neutral) stored with each feedback entry

### Core Features
- **Story Management**: Submit, view, and search news articles with filtering by category and region
- **Feedback System**: Four-dimensional rating system with optional text comments and reviewer details
- **AI Analysis**: Automatic sentiment analysis of feedback comments using TextBlob
- **Analytics Dashboard**: Comprehensive insights with charts showing feedback distribution and sentiment trends
- **Search and Filter**: Full-text search across titles, content, and authors with category/region filtering

### Data Processing Pipeline
- **Sentiment Analysis**: Real-time processing of feedback comments to extract sentiment scores and labels
- **Feedback Aggregation**: Statistical analysis of ratings and sentiment data for dashboard insights
- **Chart Data Generation**: API endpoints to serve aggregated data for interactive visualizations

### Security and Configuration
- **Session Management**: Secret key configuration via environment variables
- **Database Security**: Connection pooling with automatic reconnection and health checks
- **Proxy Support**: ProxyFix middleware for proper header handling in deployment environments

## External Dependencies

### Python Libraries
- **Flask**: Web framework and SQLAlchemy for database ORM
- **TextBlob**: Natural language processing library for sentiment analysis
- **Werkzeug**: WSGI utilities including ProxyFix middleware

### Frontend Libraries
- **Bootstrap 5**: CSS framework for responsive design and UI components
- **Chart.js**: JavaScript charting library for data visualizations
- **Font Awesome**: Icon library for consistent iconography

### Database
- **PostgreSQL**: Primary database system (configured via DATABASE_URL environment variable)
- **SQLAlchemy**: Database abstraction layer with automatic table creation

### Development Tools
- **Logging**: Python's built-in logging module for debugging and monitoring
- **Environment Variables**: Configuration management for database connections and session secrets