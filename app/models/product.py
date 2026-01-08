from mongoengine import Document, StringField, DecimalField, IntField, DateTimeField, BooleanField
from datetime import datetime

class Product(Document):
    """Product model for storing product information"""
    name = StringField(required=True, max_length=200)
    description = StringField(required=True)
    category = StringField(required=True, max_length=100)
    price = DecimalField(required=True, precision=2)
    stock = IntField(required=True, min_value=0, default=0)
    image_url = StringField()
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    is_active = BooleanField(default=True)
    
    def to_dict(self):
        """Convert product object to dictionary."""
        def format_datetime(dt):
            if dt is None:
                return None
            if isinstance(dt, str):
                return dt
            return dt.isoformat()
        
        return {
            'id': str(self.id),
            'name': self.name,
            'description': self.description,
            'category': self.category,
            'price': float(self.price) if self.price else 0.0,
            'stock': self.stock,
            'image_url': self.image_url,
            'created_at': format_datetime(self.created_at),
            'updated_at': format_datetime(self.updated_at),
            'is_active': self.is_active
        }
    
    def update_timestamp(self):
        """Update the updated_at timestamp."""
        self.updated_at = datetime.utcnow()
    
    meta = {
        'collection': 'products',
        'indexes': [
            'name',
            'category',
            'price',
            'is_active',
            {'fields': ['name', 'category'], 'unique': False}
        ],
        'ordering': ['-created_at']
    }
