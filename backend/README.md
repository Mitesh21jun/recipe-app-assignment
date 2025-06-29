# Recipe App Backend

This is a Node.js backend for a recipe application, built with Express.js and MongoDB (Mongoose).

## Features
- User authentication (JWT, bcryptjs)
- Recipe CRUD operations
- User and Recipe models
- Input validation (express-validator)
- Protected routes
- Pagination for recipe listing

## Getting Started

1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env` file in the root with your MongoDB URI and JWT secret:
   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ```
3. Start the server:
   ```sh
   node index.js
   ```

## Folder Structure
- `models/` - Mongoose schemas for User and Recipe
- `routes/` - Express route handlers
- `middleware/` - Authentication and validation middleware
- `controllers/` - Business logic for routes

## API Endpoints
- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and receive JWT
- `GET /api/recipes` - List all recipes (with pagination)
- `GET /api/recipes/:id` - Get a single recipe
- `POST /api/recipes` - Create a recipe (auth required)
- `PUT /api/recipes/:id` - Update a recipe (auth required, owner only)
- `DELETE /api/recipes/:id` - Delete a recipe (auth required, owner only)
- `GET /api/users/my-recipes` - Get recipes created by the authenticated user

## License
MIT
