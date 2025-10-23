# Database Setup Guide for Review Hub

This guide will help you set up the PostgreSQL database for the Review Hub application.

## Prerequisites

1. PostgreSQL installed on your system
2. `psql` command-line tool available
3. Administrative access to PostgreSQL

## Database Setup Steps

### 1. Create Database and User

Connect to PostgreSQL as a superuser:
```bash
psql -U postgres
```

Create the database and user:
```sql
CREATE DATABASE reviewhub;
CREATE USER reviewhub_user WITH ENCRYPTED PASSWORD '1234';
GRANT ALL PRIVILEGES ON DATABASE reviewhub TO reviewhub_user;
```

Exit psql:
```sql
\q
```

### 2. Run Database Schema

Connect to the reviewhub database:
```bash
psql -U reviewhub_user -d reviewhub
```

Run the schema file:
```sql
\i database/schema.sql
```

Exit psql:
```sql
\q
```

### 3. Configure Environment Variables

Create a `.env` file in the `backend` directory with the following content:
```
# Database Configuration
DB_USER=reviewhub_user
DB_HOST=localhost
DB_NAME=reviewhub
DB_PASSWORD=reviewhub_password
DB_PORT=5432

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=24h
```

### 4. Install PostgreSQL Adapter (if not already installed)

In the backend directory, run:
```bash
npm install pg
```

## Database Schema Overview

The database consists of the following tables:

1. **users** - Stores user information
2. **categories** - Stores review categories
3. **reviews** - Stores user reviews
4. **comments** - Stores comments on reviews
5. **comment_votes** - Stores upvotes/downvotes on comments

## Testing the Connection

After setting up the database, you can test the connection by starting the backend server:
```bash
cd backend
npm start
```

If the database connection is successful, you should see a message like:
```
Database connected successfully
```

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running
- Check that the database credentials in `.env` are correct
- Verify that PostgreSQL is accepting connections on localhost

### Authentication Failed
- Double-check the username and password
- Ensure the user has been granted privileges on the database

### Database Does Not Exist
- Make sure you've created the database as described in step 1

## Sample Data

To insert sample data for testing, you can run additional SQL commands:

```sql
-- Insert sample users
INSERT INTO users (name, email, password_hash) VALUES 
('John Doe', 'john@example.com', 'hashed_password_here'),
('Jane Smith', 'jane@example.com', 'hashed_password_here');

-- Insert sample reviews
INSERT INTO reviews (title, content, rating, user_id, category_id) VALUES 
('Great Book', 'This book was amazing!', 5, 1, 1),
('Good Movie', 'Really enjoyed this film', 4, 2, 2);
```

Note: In a real application, passwords should be properly hashed using bcrypt.