from mongoengine import Document, StringField, DateTimeField, BooleanField, URLField
from datetime import datetime

class Category(Document):
    """Category model for product categorization"""
    name = StringField(required=True, max_length=100, unique=True)
    description = StringField(required=True)
    slug = StringField(required=True, unique=True, max_length=120)
    image_url = URLField()
    is_active = BooleanField(default=True)
    created_at = DateTimeField(default=datetime.utcnow)
    updated_at = DateTimeField(default=datetime.utcnow)
    
    def to_dict(self):
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
            'slug': self.slug,
            'image_url': self.image_url,
            'is_active': self.is_active,
            'created_at': format_datetime(self.created_at),
            'updated_at': format_datetime(self.updated_at)
        }
    
    def update_timestamp(self):
        self.updated_at = datetime.utcnow()
    
    meta = {
        'collection': 'categories',
        'indexes': [
            'name',
            'slug',
            'is_active',
            {'fields': ['$name', '$description'], 'default_language': 'english'}
        ]
    }
