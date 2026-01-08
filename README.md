# AI Product Management System

A Flask-based product management system with AI-powered recommendations, user authentication, and MongoDB integration.

## Features

- User authentication (JWT-based)
- Admin and client roles
- Product CRUD operations
- AI-powered product recommendations
- Image upload support
- RESTful API
- MongoDB database

## Tech Stack

- **Backend:** Flask, MongoDB, JWT
- **AI:** OpenAI API
- **Frontend:** Next.js, React, Tailwind CSS

## Environment Variables

Create a `.env` file with the following variables:

```env
# Flask Configuration
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# Database Configuration
MONGO_DB=ai_product_mgmt
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Environment
FLASK_ENV=production
```

## Local Development

1. Clone the repository
2. Create virtual environment: `python -m venv venv`
3. Activate virtual environment: `venv\Scripts\activate` (Windows) or `source venv/bin/activate` (Linux/Mac)
4. Install dependencies: `pip install -r requirements.txt`
5. Set up environment variables in `.env` file
6. Run the application: `python run.py`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products/` - Get all products
- `POST /api/products/` - Create product (Admin only)
- `GET /api/products/<id>` - Get single product
- `PUT /api/products/<id>` - Update product (Admin only)
- `DELETE /api/products/<id>` - Delete product (Admin only)

### AI Recommendations
- `POST /api/ai/recommend` - Get AI product recommendations
- `POST /api/ai/generate/description` - Generate product description

## Deployment on Railway

1. Push your code to a GitHub repository
2. Connect your GitHub account to Railway
3. Select this repository
4. Set environment variables in Railway dashboard:
   - `MONGO_URI` - Your MongoDB connection string
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SECRET_KEY` - Generate a random secret key
   - `JWT_SECRET_KEY` - Generate a random JWT secret
   - `FLASK_ENV` - Set to `production`
5. Deploy!

## Default Admin User

To create an admin user, use the `/api/auth/register-admin` endpoint:

```json
{
    "username": "admin",
    "email": "admin@example.com",
    "password": "admin123"
}
```

## License

This project is licensed under the MIT License.
