from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import (
    create_access_token, 
    create_refresh_token,
    jwt_required, 
    get_jwt_identity,
    get_jwt
)
from ..models.user import User
from ..middleware.auth_middleware import handle_errors, admin_required, client_required

# Create a Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/test-db', methods=['GET'])
def test_db():
    """Test database connection"""
    try:
        from flask import current_app
        user_count = User.objects.count()
        return jsonify({
            'message': 'Database connection successful',
            'user_count': user_count,
            'db_config': current_app.config.get('MONGODB_SETTINGS'),
            'flask_env': current_app.config.get('ENV', 'not set')
        }), 200
    except Exception as e:
        return jsonify({
            'error': f'Database connection failed: {str(e)}'
        }), 500

@auth_bp.route('/register', methods=['POST'])
@handle_errors
def register():
    """
    Register a new user
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required: [username, email, password]
          properties:
            username:
              type: string
            email:
              type: string
            password:
              type: string
    responses:
      201:
        description: User registered successfully
      400:
        description: Invalid input
    """
    print("Registration endpoint called")
    data = request.get_json()
    print(f"Received registration data: {data}")
    
    # Validate input
    if not all(k in data for k in ['username', 'email', 'password']):
        return jsonify({'error': 'Missing required fields'}), 400
    
    # Validate email format
    if '@' not in data['email'] or '.' not in data['email']:
        return jsonify({'error': 'Invalid email format'}), 400
    
    # Check if user already exists
    if User.objects(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 400
    if User.objects(email=data['email']).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    # Create new user
    user = User(
        username=data['username'],
        email=data['email'],
        role='client'  # Default role is client
    )
    user.set_password(data['password'])
    
    try:
        user.save()
        print(f"User saved successfully: {user.username} (ID: {user.id})")
    except Exception as e:
        print(f"Error saving user: {str(e)}")
        return jsonify({'error': f'Failed to save user: {str(e)}'}), 500
    
    # Generate tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 201

@auth_bp.route('/login', methods=['POST'])
@handle_errors
def login():
    """
    User login and return JWT tokens
    ---
    parameters:
      - name: body
        in: body
        required: true
        schema:
          type: object
          required: [email, password]
          properties:
            email:
              type: string
            password:
              type: string
    responses:
      200:
        description: Login successful
      400:
        description: Invalid input
      401:
        description: Invalid credentials
    """
    data = request.get_json()
    
    # Validate input
    if not all(k in data for k in ['email', 'password']):
        return jsonify({'error': 'Missing email or password'}), 400
    
    # Find user by email
    user = User.objects(email=data['email']).first()
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid email or password'}), 401
    
    # Create tokens
    access_token = create_access_token(identity=str(user.id))
    refresh_token = create_refresh_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'refresh_token': refresh_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
@handle_errors
def refresh():
    """
    Refresh access token using refresh token
    ---
    responses:
      200:
        description: Token refreshed successfully
      401:
        description: Invalid or expired refresh token
    """
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    new_token = create_access_token(identity=current_user_id)
    
    return jsonify({
        'access_token': new_token,
        'user': user.to_dict()
    }), 200

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
@handle_errors
def get_profile():
    """
    Get current user's profile
    ---
    security:
      - Bearer: []
    responses:
      200:
        description: User profile retrieved successfully
      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify(user.to_dict()), 200

@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
@handle_errors
def update_profile():
    """
    Update current user's profile
    ---
    security:
      - Bearer: []
    parameters:
      - name: body
        in: body
        schema:
          type: object
          properties:
            username:
              type: string
            email:
              type: string
            current_password:
              type: string
            new_password:
              type: string
    responses:
      200:
        description: Profile updated successfully
      400:
        description: Invalid input
      401:
        description: Unauthorized
    """
    current_user_id = get_jwt_identity()
    user = User.objects(id=current_user_id).first()
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json()
    
    # Update username if provided
    if 'username' in data and data['username'] != user.username:
        if User.objects(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        user.username = data['username']
    
    # Update email if provided
    if 'email' in data and data['email'] != user.email:
        if User.objects(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        user.email = data['email']
    
    # Update password if current_password and new_password are provided
    if 'current_password' in data and 'new_password' in data:
        if not user.check_password(data['current_password']):
            return jsonify({'error': 'Current password is incorrect'}), 400
        user.set_password(data['new_password'])
    
    user.save()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/admin/users', methods=['GET'])
@jwt_required()
@admin_required
@handle_errors
def get_all_users():
    """
    Get all users (Admin only)
    ---
    security:
      - Bearer: []
    responses:
      200:
        description: List of users
      403:
        description: Admin access required
    """
    users = User.objects.all()
    return jsonify([user.to_dict() for user in users]), 200

@auth_bp.route('/admin/users/<user_id>', methods=['GET'])
@jwt_required()
@admin_required
@handle_errors
def get_user(user_id):
    """
    Get user by ID (Admin only)
    ---
    security:
      - Bearer: []
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: User details
      403:
        description: Admin access required
      404:
        description: User not found
    """
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    return jsonify(user.to_dict()), 200

@auth_bp.route('/admin/users/<user_id>', methods=['PUT'])
@jwt_required()
@admin_required
@handle_errors
def update_user(user_id):
    """
    Update user (Admin only)
    ---
    security:
      - Bearer: []
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
      - name: body
        in: body
        schema:
          type: object
          properties:
            username:
              type: string
            email:
              type: string
            role:
              type: string
              enum: [admin, client]
            is_active:
              type: boolean
    responses:
      200:
        description: User updated successfully
      400:
        description: Invalid input
      403:
        description: Admin access required
      404:
        description: User not found
    """
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
        
    data = request.get_json()
    
    if 'username' in data and data['username'] != user.username:
        if User.objects(username=data['username']).first():
            return jsonify({'error': 'Username already taken'}), 400
        user.username = data['username']
    
    if 'email' in data and data['email'] != user.email:
        if User.objects(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400
        user.email = data['email']
    
    if 'role' in data:
        user.role = data['role']
    
    if 'is_active' in data:
        user.is_active = data['is_active']
    
    user.save()
    
    return jsonify({
        'message': 'User updated successfully',
        'user': user.to_dict()
    }), 200

@auth_bp.route('/admin/users/<user_id>', methods=['DELETE'])
@jwt_required()
@admin_required
@handle_errors
def delete_user(user_id):
    """
    Delete user (Admin only)
    ---
    security:
      - Bearer: []
    parameters:
      - name: user_id
        in: path
        type: string
        required: true
    responses:
      200:
        description: User deleted successfully
      403:
        description: Admin access required
      404:
        description: User not found
    """
    user = User.objects(id=user_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Prevent deleting own account
    current_user_id = get_jwt_identity()
    if str(user.id) == current_user_id:
        return jsonify({'error': 'Cannot delete your own account'}), 400
    
    user.delete()
    
    return jsonify({'message': 'User deleted successfully'}), 200
