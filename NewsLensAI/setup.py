#!/usr/bin/env python3
"""
Setup script for NewsLensAI
"""

import os
import sys
import subprocess
from pathlib import Path

def check_python_version():
    """Check if Python version is compatible"""
    if sys.version_info < (3, 11):
        print("❌ Error: Python 3.11 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def install_dependencies():
    """Install project dependencies"""
    print("\n📦 Installing dependencies...")

    try:
        # Try to use uv first
        result = subprocess.run(["uv", "--version"], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ Using uv package manager")
            subprocess.run(["uv", "sync"], check=True)
            return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        pass

    try:
        # Fallback to pip
        print("✅ Using pip package manager")
        subprocess.run([sys.executable, "-m", "pip", "install", "-e", "."], check=True)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error installing dependencies: {e}")
        return False

def create_database():
    """Initialize the database"""
    print("\n🗄️ Initializing database...")

    try:
        from app import app, db
        from models import NewsStory, Feedback

        with app.app_context():
            db.create_all()
            print("✅ Database initialized successfully")
            return True
    except Exception as e:
        print(f"❌ Error initializing database: {e}")
        return False

def add_sample_data():
    """Add sample data for testing"""
    print("\n📊 Adding sample data...")

    try:
        from app import app, db
        from models import NewsStory, Feedback
        from ai_analysis import SentimentAnalyzer
        from datetime import datetime

        with app.app_context():
            # Check if we already have data
            if NewsStory.query.count() > 0:
                print("✅ Sample data already exists")
                return True

            # Add sample story
            story = NewsStory(
                title="Heavy Rains Cause Flooding in Downtown Springfield",
                content="Heavy rainfall over the past 24 hours has caused significant flooding in downtown Springfield. Emergency services are responding to multiple calls for assistance as water levels continue to rise in low-lying areas.",
                author="Jane Doe",
                publication="Springfield Daily News",
                category="Weather",
                region="Downtown Springfield, North County",
                date_published=datetime.utcnow()
            )

            db.session.add(story)
            db.session.commit()

            print("✅ Sample story added")
            return True

    except Exception as e:
        print(f"❌ Error adding sample data: {e}")
        return False

def print_success_message():
    """Print success message with next steps"""
    print("\n" + "="*60)
    print("🎉 NewsLensAI Setup Complete!")
    print("="*60)
    print("\n🚀 To start the application:")
    print("   uv run python main.py")
    print("\n🌐 Access the application:")
    print("   • Homepage: http://localhost:5000")
    print("   • Dashboard: http://localhost:5000/dashboard")
    print("   • Submit Story: http://localhost:5000/submit-story")
    print("\n📚 For more information, see README.md")
    print("="*60)

def main():
    """Main setup function"""
    print("🔧 NewsLensAI Setup")
    print("="*30)

    # Check Python version
    if not check_python_version():
        sys.exit(1)

    # Install dependencies
    if not install_dependencies():
        sys.exit(1)

    # Initialize database
    if not create_database():
        sys.exit(1)

    # Add sample data
    add_sample_data()

    # Print success message
    print_success_message()

if __name__ == "__main__":
    main()
