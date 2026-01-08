from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..controllers.category_controller import (
    create_category, 
    get_all_categories, 
    get_category, 
    update_category, 
    delete_category
)

def admin_required(fn):
    """Decorator to ensure the user is an admin"""
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        return fn(*args, **kwargs)
    
    # Preserve the original function's name and docstring
    wrapper.__name__ = fn.__name__
    wrapper.__doc__ = fn.__doc__
    return wrapper

category_bp = Blueprint('category', __name__)

# Create a new category (Admin only)
@category_bp.route('', methods=['POST'])
@jwt_required()
@admin_required
def create_category_route():
    return create_category()

# Get all categories (Public)
@category_bp.route('', methods=['GET'])
def get_all_categories_route():
    return get_all_categories()

# Get a specific category (Public)
@category_bp.route('/<string:category_id>', methods=['GET'])
def get_category_route(category_id):
    return get_category(category_id)

# Update a category (Admin only)
@category_bp.route('/<string:category_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_category_route(category_id):
    return update_category(category_id)

# Delete a category (Admin only, soft delete)
@category_bp.route('/<string:category_id>', methods=['DELETE'])
@jwt_required()
@admin_required
def delete_category_route(category_id):
    return delete_category(category_id)
