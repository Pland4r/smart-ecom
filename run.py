import os
from flask_cors import CORS
from app import create_app

# Create the Flask app instance
app = create_app(os.getenv('FLASK_ENV', 'development'))

# Configure CORS
# Allow frontend origin from Railway environment variable
frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": [frontend_url, "http://localhost:3000", "http://127.0.0.1:3000"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
            "supports_credentials": True
        }
    }
)

# Add explicit OPTIONS handler for CORS preflight
@app.before_request
def handle_preflight():
    from flask import request
    if request.method == "OPTIONS":
        from flask import make_response
        response = make_response()
        origin = request.headers.get('Origin')
        if origin in ['http://localhost:3000', 'http://127.0.0.1:3000']:
            response.headers.add("Access-Control-Allow-Origin", origin)
        response.headers.add('Access-Control-Allow-Headers', "Content-Type, Authorization")
        response.headers.add('Access-Control-Allow-Methods', "GET, POST, PUT, DELETE, OPTIONS")
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

# Global error handler to catch unhandled exceptions
@app.errorhandler(Exception)
def handle_exception(e):
    from flask import jsonify
    print(f"Unhandled exception: {str(e)}")
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Create upload directory if it doesn't exist
    upload_folder = app.config.get('UPLOAD_FOLDER')
    if upload_folder:
        os.makedirs(upload_folder, exist_ok=True)
    
    # Run the application
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('FLASK_ENV') == 'development'
    app.run(debug=debug, host='0.0.0.0', port=port)