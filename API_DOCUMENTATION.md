# Review Hub - API Documentation

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

### Register User
**POST** `/api/users/register`

Registers a new user account.

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "message": "User registered successfully",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Login User
**POST** `/api/users/login`

Authenticates a user and returns a JWT token.

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response**:
```json
{
  "message": "Login successful",
  "token": "jwt_token",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Get User Profile
**GET** `/api/users/profile`

Retrieves the authenticated user's profile information.

**Response**:
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "bio": "A passionate reviewer",
    "created_at": "2025-01-01T00:00:00.000Z",
    "reviews_count": 10,
    "comments_count": 25
  }
}
```

## Reviews

### Get Reviews
**GET** `/api/reviews`

Retrieves a list of reviews with optional filtering and sorting.

**Query Parameters**:
- `category` (optional): Filter by category (books, movies, restaurants, products)
- `sortBy` (optional): Sort order (newest, rating-high, rating-low)

**Response**:
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "content": "A masterpiece of American literature...",
    "rating": 4,
    "created_at": "2025-01-01T00:00:00.000Z",
    "author": "Jane Smith",
    "category": "books"
  }
]
```

### Get Review by ID
**GET** `/api/reviews/{id}`

Retrieves a specific review by its ID.

**Response**:
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "content": "A masterpiece of American literature...",
  "rating": 4,
  "created_at": "2025-01-01T00:00:00.000Z",
  "author": "Jane Smith",
  "category": "books",
  "comments": [
    {
      "id": 1,
      "content": "Great review!",
      "created_at": "2025-01-02T00:00:00.000Z",
      "author": "John Doe",
      "upvotes": 5,
      "downvotes": 1
    }
  ]
}
```

### Create Review
**POST** `/api/reviews`

Creates a new review (requires authentication).

**Request Body**:
```json
{
  "title": "Inception",
  "content": "A mind-bending thriller...",
  "rating": 5,
  "category": "movies"
}
```

**Response**:
```json
{
  "message": "Review created successfully",
  "review": {
    "id": 2,
    "title": "Inception",
    "content": "A mind-bending thriller...",
    "rating": 5,
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

## Comments

### Add Comment to Review
**POST** `/api/reviews/{id}/comments`

Adds a comment to a specific review (requires authentication).

**Request Body**:
```json
{
  "content": "I agree with this review!",
  "parentCommentId": 1 // Optional, for replies
}
```

**Response**:
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": 3,
    "content": "I agree with this review!",
    "created_at": "2025-01-01T00:00:00.000Z"
  }
}
```

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request**:
```json
{
  "message": "Invalid input data"
}
```

**401 Unauthorized**:
```json
{
  "message": "Access token required"
}
```

**403 Forbidden**:
```json
{
  "message": "Invalid or expired token"
}
```

**404 Not Found**:
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error**:
```json
{
  "message": "Server error"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- 100 requests per hour per IP address
- 10 requests per minute for authentication endpoints

## CORS Policy

The API allows requests from the following origins:
- `http://localhost:3000` (development)
- `https://reviewhub.com` (production)

## Versioning

This documentation reflects API version 1.0. Future versions will be accessible through versioned endpoints (e.g., `/api/v2/`).