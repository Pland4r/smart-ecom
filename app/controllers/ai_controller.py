import os
from openai import OpenAI
from flask import request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.user import User
from ..models.product import Product

# Initialize GitHub Copilot client
github_token = os.environ.get("OPENAI_API_KEY")
endpoint = "https://models.github.ai/inference"
model = "openai/gpt-4.1"

client = OpenAI(
    base_url=endpoint,
    api_key=github_token,
)

def get_filtered_products(filters=None):
    """Helper function to get filtered products"""
    query = Product.objects(is_active=True)
    
    if filters:
        if 'category' in filters:
            query = query(category=filters['category'])
        if 'min_price' in filters and filters['min_price'] is not None:
            query = query(price__gte=float(filters['min_price']))
        if 'max_price' in filters and filters['max_price'] is not None:
            query = query(price__lte=float(filters['max_price']))
        if 'in_stock_only' in filters and filters['in_stock_only']:
            query = query(stock__gt=0)
    
    return query.all()

@jwt_required()
def get_product_recommendations():
    """
    Get AI-powered product recommendations based on user query using GitHub Copilot
    """
    try:
        current_user_id = get_jwt_identity()
        user = User.objects(id=current_user_id).first()
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        data = request.get_json()
        print(f"AI Recommendation request data: {data}")  # Debug
        user_query = data.get('query', '')
        filters = data.get('filters', {})
        print(f"Parsed query: '{user_query}', filters: {filters}")  # Debug
        
        if not user_query and not filters:
            return jsonify({'error': 'Query or filters are required'}), 400
        
        # Extract budget from query if present
        import re
        budget_match = re.search(r'under\s*\$?(\d+)', user_query.lower())
        if budget_match:
            max_budget = float(budget_match.group(1))
            filters['max_price'] = max_budget
            print(f"Extracted budget: ${max_budget}")  # Debug
        
        # Get filtered products
        products = get_filtered_products(filters)
        products_data = [{
            'name': p.name,
            'description': p.description,
            'category': p.category,
            'price': float(p.price) if p.price else 0.0,
            'stock': p.stock,
            'rating': getattr(p, 'rating', 0),
            'popularity': getattr(p, 'popularity', 0)
        } for p in products]
        
        # Build the AI prompt
        system_prompt = """You are a helpful shopping assistant. 
        Your task is to recommend products based on the user's query and filters.
        Consider the following when making recommendations:
        - Product name, description, and category
        - Price range and value for money
        - Stock availability
        - User preferences (if any)
        - Product ratings and popularity
        
        Be concise, helpful, and explain your recommendations."""
        
        user_prompt = f"""User query: {user_query or 'No specific query provided'}

        Filters applied:
        - Category: {filters.get('category', 'Any')}
        - Price Range: ${filters.get('min_price', '0')} - ${filters.get('max_price', 'Any')}
        - In Stock Only: {filters.get('in_stock_only', False)}

        Filtered Products (matching criteria):
        {products_data}

        Please provide:
        1. A brief response confirming the filtered results
        2. Highlight the products that best match the user's specific request
        3. Keep the response concise and focused on the available products"""
        
        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.7,
            top_p=0.9,
            max_tokens=1000
        )

        ai_response = response.choices[0].message.content
        
        # Get top 3 products for recommendations
        top_products = products[:3]
        product_recommendations = [{
            'id': str(p.id),
            'name': p.name,
            'description': p.description,
            'category': p.category,
            'price': float(p.price) if p.price else 0.0,
            'image_url': p.image_url,
            'stock': p.stock
        } for p in top_products]

        return jsonify({
            'recommendations': ai_response,
            'products': product_recommendations,
            'filtered_products_count': len(products_data),
            'filters_applied': filters
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jwt_required()
def get_category_recommendations():
    """Get AI-powered category-based recommendations"""
    try:
        data = request.get_json()
        category = data.get('category', '')
        
        if not category:
            return jsonify({'error': 'Category is required'}), 400
            
        # Get top products in this category
        products = Product.objects(
            category=category,
            is_active=True,
            stock__gt=0
        ).order_by('-rating', '-stock').limit(5)
        
        products_data = [{
            'name': p.name,
            'description': p.description,
            'price': float(p.price) if p.price else 0.0,
            'stock': p.stock,
            'rating': getattr(p, 'rating', 0)
        } for p in products]

        system_prompt = f"""You are a shopping assistant specializing in {category}.
        Recommend the best products from this category based on:
        - Product quality and features
        - Customer ratings
        - Value for money
        - Current availability
        
        Be enthusiastic but honest in your recommendations."""

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Recommend the best {category} products from: {products_data}"}
            ],
            temperature=0.7
        )

        return jsonify({
            'category': category,
            'recommendations': response.choices[0].message.content,
            'products': products_data
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jwt_required()
def get_price_based_recommendations():
    """Get AI-powered recommendations based on price range"""
    try:
        data = request.get_json()
        min_price = float(data.get('min_price', 0))
        max_price = float(data.get('max_price', float('inf')))
        
        if min_price >= max_price:
            return jsonify({'error': 'Invalid price range'}), 400
            
        # Get products in price range
        products = Product.objects(
            price__gte=min_price,
            price__lte=max_price,
            is_active=True,
            stock__gt=0
        ).order_by('-rating', 'price')
        
        if not products:
            return jsonify({'error': 'No products found in this price range'}), 404

        products_data = [{
            'name': p.name,
            'category': p.category,
            'price': float(p.price) if p.price else 0.0,
            'rating': getattr(p, 'rating', 0)
        } for p in products]

        system_prompt = f"""You are a budget shopping assistant. 
        Recommend the best value products between ${min_price} and ${max_price}.
        Consider:
        - Price-to-quality ratio
        - Customer satisfaction
        - Brand reputation
        - Feature set
        
        Group recommendations by price tiers if applicable."""

        response = client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Recommend products in this price range: {products_data}"}
            ],
            temperature=0.5
        )

        return jsonify({
            'price_range': f"${min_price} - ${max_price}",
            'recommendations': response.choices[0].message.content,
            'product_count': len(products_data)
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@jwt_required()
def generate_product_description():
    """
    Generate product description using AI
    """
    try:
        data = request.get_json()
        product_name = data.get('name', '')
        category = data.get('category', '')
        features = data.get('features', [])
        price = data.get('price', '')
        
        if not product_name or not category:
            return jsonify({'error': 'Product name and category are required'}), 400
            
        system_prompt = """You are a professional product description writer. 
        Create an engaging, SEO-friendly product description that highlights the key features and benefits.
        Consider the product's price point and target audience."""
        
        user_prompt = f"""Write a product description for:
        - Name: {product_name}
        - Category: {category}
        - Price: {f'${price}' if price else 'Not specified'}
        - Features: {', '.join(features) if features else 'Not specified'}
        
        Make it compelling and include relevant keywords naturally.
        Focus on benefits, not just features."""
        
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            temperature=0.8,
            top_p=1.0,
            model=model
        )
        
        description = response.choices[0].message.content
        
        return jsonify({
            'description': description.strip(),
            'product': {
                'name': product_name,
                'category': category,
                'price': price
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500