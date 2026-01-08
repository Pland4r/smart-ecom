from functools import wraps
from flask import jsonify
from flask_jwt_extended import get_jwt_identity, verify_jwt_in_request
from ..models.user import User

def admin_required(fn):
    """
    Decorator to ensure the user has admin privileges.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        return fn(*args, **kwargs)
    return wrapper

def client_required(fn):
    """
    Decorator to ensure the user is authenticated as a client.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({'error': 'Authentication required'}), 401
            
        return fn(*args, **kwargs)
    return wrapper

def handle_errors(fn):
    """
    Global error handler for all routes.
    """
    @wraps(fn)
    def wrapper(*args, **kwargs):
        try:
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({
                'error': str(e),
                'status': 'error'
            }), 500
    return wrapper
