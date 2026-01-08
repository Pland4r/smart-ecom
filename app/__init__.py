from flask import Flask
from flask_mongoengine import MongoEngine
from flask_login import LoginManager
from flask_jwt_extended import JWTManager
from config import config

db = MongoEngine()
login_manager = LoginManager()
jwt = JWTManager()
login_manager.login_view = 'auth.login'
login_manager.login_message_category = 'info'

def create_app(config_name='default'):
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    login_manager.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.user import user_bp
    from .routes.product import product_bp
    from .routes.ai import ai_bp
    from .routes.category import category_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(user_bp, url_prefix='/api/users')
    app.register_blueprint(product_bp, url_prefix='/api/products')
    app.register_blueprint(ai_bp, url_prefix='/api/ai')
    app.register_blueprint(category_bp, url_prefix='/api/categories')
    
    # Error handlers
    @app.errorhandler(404)
    def not_found_error(error):
        return {'error': 'Not Found'}, 404
    
    @app.errorhandler(500)
    def internal_error(error):
        db.session.rollback()
        return {'error': 'Internal Server Error'}, 500
    
    return app
