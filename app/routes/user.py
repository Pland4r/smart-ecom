from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..middleware.auth_middleware import admin_required, handle_errors

# Create a Blueprint for user routes
user_bp = Blueprint('user', __name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
@admin_required
@handle_errors
def get_users():
    """Get all users (Admin only)"""
    users = User.objects.all()
    return jsonify([user.to_dict() for user in users]), 200

@user_bp.route('/<user_id>', methods=['GET'])
@jwt_required()
@admin_required
@handle_errors
def get_user(user_id):
    """Get a specific user by ID (Admin only)"""
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user.to_dict()), 200

@user_bp.route('/<user_id>', methods=['PUT'])
@jwt_required()
@admin_required
@handle_errors
def update_user(user_id):
    """Update a user (Admin only)"""
    data = request.get_json()
    user = User.objects(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Prevent updating your own role
    current_user_id = get_jwt_identity()
    if str(user.id) == current_user_id and 'role' in data:
        return jsonify({'error': 'Cannot modify your own role'}), 400
    
    if 'username' in data:
        user.username = data['username']
    if 'email' in data:
        user.email = data['email']
    if 'role' in data:
        user.role = data['role']
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    user.save()
    return jsonify(user.to_dict()), 200

@user_bp.route('/<user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
@handle_errors
def delete_user(user_id):
    """Delete a user (Admin only)"""
    user = User.objects(id=user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Prevent deleting your own account
    current_user_id = get_jwt_identity()
    if str(user.id) == current_user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    user.delete()
    return jsonify({'message': 'User deleted successfully'}), 200
