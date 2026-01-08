from mongoengine import Document, StringField, DateTimeField, BooleanField
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash

class User(Document):
    """User model for authentication and authorization"""
    username = StringField(required=True, unique=True, max_length=50)
    email = StringField(required=True, unique=True, max_length=120)
    password_hash = StringField(required=True)
    role = StringField(required=True, default='client', choices=['admin', 'client'])
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)
    
    def set_password(self, password):
        """Create hashed password."""
        self.password_hash = generate_password_hash(password)
        self.updated_at = datetime.utcnow()
    
    def check_password(self, password):
        """Check hashed password."""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert user object to dictionary."""
        def format_datetime(dt):
            if dt is None:
                return None
            if isinstance(dt, str):
                return dt
            return dt.isoformat()
        
        return {
            'id': str(self.id),
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'created_at': format_datetime(self.created_at),
            'updated_at': format_datetime(self.updated_at),
            'is_active': self.is_active
        }
    
    def is_admin(self):
        """Check if user has admin role."""
        return self.role == 'admin'
    
    meta = {
        'collection': 'users',
        'indexes': [
            'username',
            'email',
            'role',
            'is_active'
        ]
    }
