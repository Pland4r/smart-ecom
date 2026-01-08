from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.product import Product
from ..models.user import User

def get_products():
    """Get all products"""
    try:
        products = Product.objects.all()
        return jsonify([p.to_dict() for p in products]), 200
    except Exception as e:
        print(f"Error in get_products: {str(e)}")
        return jsonify({'error': str(e)}), 500

@jwt_required()
def create_product():
    """Create a new product (Admin only)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        # Check if user is admin
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
        
        # Get product data from request
        data = request.get_json()
        print(f"Creating product with data: {data}")
        
        # Create new product
        product = Product(
            name=data['name'],
            description=data.get('description', ''),
            category=data.get('category', 'general'),
            price=float(data['price']),
            stock=int(data.get('stock', 0)),
            image_url=data.get('image_url', '')
        )
        product.save()
        
        return jsonify(product.to_dict()), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@jwt_required()
def get_product(product_id):
    """Get a single product by ID"""
    try:
        product = Product.objects(id=product_id, is_active=True).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        return jsonify(product.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@jwt_required()
def update_product(product_id):
    """Update a product (Admin only)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        # Check if user is admin
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        # Get product
        product = Product.objects(id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        # Update product data
        data = request.get_json()
        
        # Debug: Print what we're receiving (remove this after debugging)
        print(f"Received data: {data}")
        
        # Explicitly update only the fields we want
        if 'name' in data:
            product.name = data['name']
        if 'description' in data:
            product.description = data['description']
        if 'category' in data:
            product.category = data['category']
        if 'image_url' in data:
            product.image_url = data['image_url']
        if 'is_active' in data:
            product.is_active = bool(data['is_active'])
        if 'price' in data:
            product.price = float(data['price'])
        if 'stock' in data:
            product.stock = int(data['stock'])
        
        # Update the timestamp
        product.update_timestamp()
        
        # Ensure datetime fields are proper datetime objects before saving
        if hasattr(product, 'created_at') and isinstance(product.created_at, str):
            from datetime import datetime
            try:
                product.created_at = datetime.fromisoformat(product.created_at.replace('Z', '+00:00'))
            except:
                product.created_at = datetime.utcnow()
        
        product.save()
        
        return jsonify(product.to_dict()), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@jwt_required()
def delete_product(product_id):
    """Delete a product (Admin only)"""
    try:
        # Get current user
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        # Check if user is admin
        if not user or not user.is_admin():
            return jsonify({'error': 'Admin access required'}), 403
            
        # Hard delete the product
        product = Product.objects(id=product_id).first()
        if not product:
            return jsonify({'error': 'Product not found'}), 404
            
        product.delete()
        
        return jsonify({'message': 'Product deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400
