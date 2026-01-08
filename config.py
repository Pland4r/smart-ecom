import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Config:
    # Flask settings
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-key-please-change-in-production'
    
    # MongoDB settings
    MONGODB_SETTINGS = {
        'db': os.environ.get('MONGO_DB', 'ai_product_mgmt'),
        'host': os.environ.get('MONGO_URI', 'mongodb://localhost:27017/ai_product_mgmt'),
        'connect': False
    }
    
    # JWT settings
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key-change-in-production'
    JWT_ACCESS_TOKEN_EXPIRES = 3600  # 1 hour
    
    # OpenAI settings
    OPENAI_API_KEY = os.environ.get('OPENAI_API_KEY', '')
    
    # Upload settings
    UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'app/static/uploads')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max file size

class DevelopmentConfig(Config):
    DEBUG = True
    TESTING = False

class TestingConfig(Config):
    TESTING = True
    MONGODB_SETTINGS = {
        'db': 'test_ai_product_mgmt',
        'host': 'mongomock://localhost'
    }

class ProductionConfig(Config):
    DEBUG = False
    TESTING = False
    
    def __init__(self):
        super().__init__()
        # Override MongoDB settings for production
        self.MONGODB_SETTINGS = {
            'db': os.environ.get('MONGO_DB', 'ai_product_mgmt'),
            'host': os.environ.get('MONGO_URI', 'mongodb://localhost:27017/ai_product_mgmt'),
            'connect': False
        }

# Set the active configuration
config = {
    'development': DevelopmentConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': DevelopmentConfig
}
