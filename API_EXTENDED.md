# Extended API Documentation for Review Hub

This document describes the extended API endpoints for the Review Hub application.

## Authentication

### Register User
**POST** `/api/users/register`

Registers a new user.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "bio": "string (optional)"
}
```

**Response:**
```json
{
  "message": "User registered successfully",
  "token": "JWT token",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "bio": "string"
  }
}
```

### Login User
**POST** `/api/users/login`

Authenticates a user and returns a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "JWT token",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "bio": "string"
  }
}
```

## User Profile

### Get User Profile
**GET** `/api/users/profile`

Retrieves the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "bio": "string",
    "created_at": "timestamp",
    "reviews_count": "number",
    "comments_count": "number"
  }
}
```

### Update User Profile
**PUT** `/api/users/profile`

Updates the authenticated user's profile information.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string (optional)",
  "email": "string (optional)",
  "bio": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "bio": "string",
    "created_at": "timestamp"
  }
}
```

### Change Password
**PUT** `/api/users/change-password`

Changes the authenticated user's password.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```

**Response:**
```json
{
  "message": "Password changed successfully"
}
```

### Get User Reviews
**GET** `/api/users/reviews`

Retrieves the authenticated user's reviews.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of reviews to return (default: 10)
- `offset` (optional): Number of reviews to skip (default: 0)

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "rating": "number",
    "created_at": "timestamp",
    "category": "string"
  }
]
```

### Get User Comments
**GET** `/api/users/comments`

Retrieves the authenticated user's comments.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `limit` (optional): Number of comments to return (default: 10)
- `offset` (optional): Number of comments to skip (default: 0)

**Response:**
```json
[
  {
    "id": "number",
    "content": "string",
    "created_at": "timestamp",
    "review_title": "string",
    "review_id": "number"
  }
]
```

## Reviews

### Get Reviews
**GET** `/api/reviews`

Retrieves all reviews with optional filtering and sorting.

**Query Parameters:**
- `category` (optional): Filter by category
- `sortBy` (optional): Sort order ('newest', 'rating-high', 'rating-low')
- `limit` (optional): Number of reviews to return
- `offset` (optional): Number of reviews to skip

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "rating": "number",
    "created_at": "timestamp",
    "author": "string",
    "category": "string"
  }
]
```

### Search Reviews
**GET** `/api/reviews/search`

Searches reviews by title or content.

**Query Parameters:**
- `query` (required): Search query
- `category` (optional): Filter by category
- `sortBy` (optional): Sort order ('newest', 'rating-high', 'rating-low')

**Response:**
```json
[
  {
    "id": "number",
    "title": "string",
    "content": "string",
    "rating": "number",
    "created_at": "timestamp",
    "author": "string",
    "category": "string"
  }
]
```

### Get Categories
**GET** `/api/reviews/categories`

Retrieves all available categories.

**Response:**
```json
[
  {
    "id": "number",
    "name": "string"
  }
]
```

### Get Review by ID
**GET** `/api/reviews/:id`

Retrieves a specific review by ID.

**Response:**
```json
{
  "id": "number",
  "title": "string",
  "content": "string",
  "rating": "number",
  "created_at": "timestamp",
  "author": "string",
  "category": "string",
  "comments": [
    {
      "id": "number",
      "content": "string",
      "created_at": "timestamp",
      "author": "string",
      "upvotes": "number",
      "downvotes": "number"
    }
  ]
}
```

### Create Review
**POST** `/api/reviews`

Creates a new review.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string",
  "content": "string",
  "rating": "number (1-5)",
  "category": "string"
}
```

**Response:**
```json
{
  "message": "Review created successfully",
  "review": {
    "id": "number",
    "title": "string",
    "content": "string",
    "rating": "number",
    "created_at": "timestamp"
  }
}
```

### Update Review
**PUT** `/api/reviews/:id`

Updates an existing review.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "rating": "number (1-5, optional)",
  "category": "string (optional)"
}
```

**Response:**
```json
{
  "message": "Review updated successfully",
  "review": {
    "id": "number",
    "title": "string",
    "content": "string",
    "rating": "number",
    "created_at": "timestamp"
  }
}
```

### Delete Review
**DELETE** `/api/reviews/:id`

Deletes a review.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "message": "Review deleted successfully"
}
```

### Add Comment to Review
**POST** `/api/reviews/:id/comments`

Adds a comment to a review.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "content": "string",
  "parentCommentId": "number (optional, for replies)"
}
```

**Response:**
```json
{
  "message": "Comment added successfully",
  "comment": {
    "id": "number",
    "content": "string",
    "created_at": "timestamp"
  }
}
```

### Vote on Comment
**POST** `/api/reviews/:id/comments/:commentId/vote`

Votes on a comment (upvote or downvote).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "voteType": "string ('up' or 'down')"
}
```

**Response:**
```json
{
  "message": "Vote added" | "Vote updated" | "Vote removed"
}
```

## Error Responses

All error responses follow this format:
```json
{
  "message": "Error description"
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error