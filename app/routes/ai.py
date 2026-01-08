from flask import Blueprint
from ..controllers import ai_controller

# Create a Blueprint for AI routes
ai_bp = Blueprint('ai', __name__)

# Define routes
ai_bp.route('/recommend', methods=['POST'])(ai_controller.get_product_recommendations)
ai_bp.route('/recommend/category', methods=['POST'])(ai_controller.get_category_recommendations)
ai_bp.route('/recommend/price', methods=['POST'])(ai_controller.get_price_based_recommendations)
ai_bp.route('/generate/description', methods=['POST'])(ai_controller.generate_product_description)
