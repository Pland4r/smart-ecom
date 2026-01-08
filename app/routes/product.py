from flask import Blueprint
from ..controllers import product_controller

# Create a Blueprint for product routes
product_bp = Blueprint('product', __name__)

# Define routes
product_bp.route('/', methods=['GET'])(product_controller.get_products)
product_bp.route('/', methods=['POST'])(product_controller.create_product)
product_bp.route('/<product_id>', methods=['GET'])(product_controller.get_product)
product_bp.route('/<product_id>', methods=['PUT'])(product_controller.update_product)
product_bp.route('/<product_id>', methods=['DELETE'])(product_controller.delete_product)
