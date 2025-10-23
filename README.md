# Review Hub

A fully functional responsive website for reading, writing, and rating reviews on different items (books, movies, restaurants, products).

## Features

- **Clean non-color greyscale design** using only black, white, and shades of grey
- **Responsive design** that works on desktop, tablet, and mobile
- **User authentication** with secure login/signup
- **Review system** with 1-5 star ratings
- **Comment system** with nested replies
- **Search functionality** with AJAX live search
- **Category filtering** and sorting options
- **User profiles** with review history

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt.js

## Project Structure

```
review-hub/
├── frontend/
│   ├── css/
│   ├── js/
│   ├── assets/
│   ├── index.html
│   ├── categories.html
│   ├── write-review.html
│   ├── profile.html
│   ├── about.html
│   └── review.html
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
└── database/
    └── schema.sql
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd review-hub
   ```

2. Install frontend dependencies:
   ```bash
   # Frontend dependencies are CDN-based, no installation needed
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up the database:
   ```bash
   # Create a PostgreSQL database named 'reviewhub'
   # Update the .env file with your database credentials
   # Run the schema.sql file to create tables
   ```

5. Configure environment variables:
   ```bash
   # Update the .env file in the backend directory with your settings
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev  # For development with nodemon
   # or
   npm start    # For production
   ```

2. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## API Endpoints

- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/:id` - Get a specific review
- `POST /api/reviews` - Create a new review
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

## Design Features

- **Greyscale Color Scheme**: Uses only black, white, and shades of grey
- **Typography**: Mix of serif and sans-serif fonts for contrast
- **Visual Elements**: 
  - Box shadows instead of colors for depth
  - Minimal icons
  - Subtle geometric patterns
  - Creative button designs with shadow effects
- **Animations**: 
  - Fade, slide, and expand transitions
  - Interactive star rating system
  - Hover effects on buttons and cards

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a pull request

## License

This project is licensed under the MIT License.