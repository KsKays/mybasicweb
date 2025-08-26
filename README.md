# MyBasicWeb - User Registration Form

A simple user registration form with SQLite database integration.

## Features

- **Registration Form** with the following fields:
  - Full Name (Text input)
  - Gender (Dropdown selection)
  - Email (Email input with validation)
  - Country (Dropdown selection with multiple countries)

- **Backend Features**:
  - Express.js server
  - SQLite database for data storage
  - Form validation (client-side and server-side)
  - Duplicate email prevention
  - RESTful API endpoints

- **Frontend Features**:
  - Responsive design
  - Real-time form validation
  - Beautiful gradient styling
  - Success/error message display
  - Mobile-friendly interface

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/KsKays/mybasicweb.git
   cd mybasicweb
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

4. **Access the application**:
   Open your browser and go to `http://localhost:3000`

## API Endpoints

- `GET /` - Serve the registration form
- `POST /register` - Submit registration data
- `GET /users` - Get all registered users (for testing)
- `GET /users/count` - Get total user count

## Database Schema

The SQLite database (`users.db`) contains a `users` table with:

- `id` - Primary key (auto-increment)
- `name` - User's full name
- `gender` - Selected gender
- `email` - User's email (unique)
- `country` - Selected country
- `created_at` - Registration timestamp

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Styling**: CSS Grid/Flexbox, Gradient backgrounds

## Project Structure

```
mybasicweb/
├── index.html          # Main registration form
├── styles.css          # Styling for the form
├── script.js           # Client-side JavaScript
├── server.js           # Express server
├── package.json        # Node.js dependencies
├── users.db           # SQLite database (created automatically)
└── README.md          # Project documentation
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License