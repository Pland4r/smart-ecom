from flask import jsonify, request
from bson import ObjectId
from werkzeug.security import generate_password_hash
from datetime import datetime
import re
from app.models.category import Category

def create_category():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data.get('name') or not data.get('description'):
            return jsonify({'error': 'Name and description are required'}), 400
        
        # Create slug from name
        slug = re.sub(r'[^\w\s-]', '', data['name']).strip().lower()
        slug = re.sub(r'[-\s]+', '-', slug)
        
        # Check if category with same name or slug already exists
        if Category.objects(name=data['name']).first():
            return jsonify({'error': 'Category with this name already exists'}), 400
            
        if Category.objects(slug=slug).first():
            return jsonify({'error': 'Category with this slug already exists'}), 400
        
        # Create new category
        category = Category(
            name=data['name'],
            description=data['description'],
            slug=slug,
            image_url=data.get('image_url', '')
        )
        category.save()
        
        return jsonify({
            'message': 'Category created successfully',
            'category': category.to_dict()
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_all_categories():
    try:
        categories = Category.objects(is_active=True)
        return jsonify({
            'categories': [category.to_dict() for category in categories]
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_category(category_id):
    try:
        if not ObjectId.is_valid(category_id):
            return jsonify({'error': 'Invalid category ID'}), 400
            
        category = Category.objects(id=category_id, is_active=True).first()
        if not category:
            return jsonify({'error': 'Category not found'}), 404
            
        return jsonify(category.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def update_category(category_id):
    try:
        if not ObjectId.is_valid(category_id):
            return jsonify({'error': 'Invalid category ID'}), 400
            
        data = request.get_json()
        category = Category.objects(id=category_id, is_active=True).first()
        
        if not category:
            return jsonify({'error': 'Category not found'}), 404
            
        # Update fields if provided
        if 'name' in data:
            # Check if new name is already taken
            if data['name'] != category.name and Category.objects(name=data['name']).first():
                return jsonify({'error': 'Category with this name already exists'}), 400
            category.name = data['name']
            
        if 'description' in data:
            category.description = data['description']
            
        if 'image_url' in data:
            category.image_url = data['image_url']
            
        if 'is_active' in data:
            category.is_active = bool(data['is_active'])
            
        # Update slug if name changed
        if 'name' in data:
            slug = re.sub(r'[^\w\s-]', '', data['name']).strip().lower()
            category.slug = re.sub(r'[-\s]+', '-', slug)
            
        category.updated_at = datetime.utcnow()
        category.save()
        
        return jsonify({
            'message': 'Category updated successfully',
            'category': category.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def delete_category(category_id):
    try:
        if not ObjectId.is_valid(category_id):
            return jsonify({'error': 'Invalid category ID'}), 400
            
        category = Category.objects(id=category_id).first()
        
        if not category:
            return jsonify({'error': 'Category not found'}), 404
            
        # Soft delete (set is_active to False)
        category.is_active = False
        category.updated_at = datetime.utcnow()
        category.save()
        
        return jsonify({'message': 'Category deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
