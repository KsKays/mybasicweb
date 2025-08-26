# MyBasicWeb - User Registration Form

A simple user registration form with SQLite database integration and comprehensive Playwright testing.

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

- **Testing Features**:
  - Comprehensive Playwright test suite
  - End-to-end testing across multiple browsers
  - Performance and load testing
  - Visual regression testing
  - API endpoint testing
  - Database integration testing

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

3. **Install Playwright browsers** (for testing):
   ```bash
   npx playwright install
   ```

4. **Start the server**:
   ```bash
   npm start
   ```
   
   Or for development with auto-reload:
   ```bash
   npm run dev
   ```

5. **Access the application**:
   Open your browser and go to `http://localhost:3000`

## Testing

This project includes comprehensive testing with **Playwright**:

### Quick Test Commands
```bash
# Run all tests
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in debug mode  
npm run test:debug

# Run specific test suites
npm run test:form      # Form functionality tests
npm run test:api       # API endpoint tests
npm run test:visual    # Visual & accessibility tests
npm run test:db        # Database integration tests
npm run test:perf      # Performance tests

# View test report
npm run test:report
```

### Test Coverage
- ✅ **Form Testing**: Field validation, submissions, multi-language support
- ✅ **API Testing**: Endpoints, error handling, data validation
- ✅ **Visual Testing**: Styling, responsive design, accessibility
- ✅ **Database Testing**: CRUD operations, concurrency, data integrity
- ✅ **Performance Testing**: Load times, concurrent users, memory usage

### Supported Browsers
- Chrome/Chromium
- Firefox
- Safari/WebKit
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

For detailed testing documentation, see [TESTING.md](TESTING.md).

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
- **Testing**: Playwright
- **Styling**: CSS Grid/Flexbox, Gradient backgrounds

## Project Structure

```
mybasicweb/
├── index.html              # Main registration form
├── styles.css              # Styling for the form
├── script.js               # Client-side JavaScript
├── server.js               # Express server
├── package.json            # Node.js dependencies
├── playwright.config.js    # Playwright test configuration
├── test-runner.js          # Custom test runner utility
├── tests/                  # Test suite directory
│   ├── registration-form.spec.js     # Form functionality tests
│   ├── api-endpoints.spec.js         # API endpoint tests
│   ├── visual-accessibility.spec.js  # Visual & accessibility tests
│   ├── database-integration.spec.js  # Database tests
│   └── performance-load.spec.js      # Performance tests
├── .github/workflows/      # CI/CD workflows
├── TESTING.md             # Comprehensive testing documentation
├── TEST_RESULTS.md        # Previous test results
└── README.md              # Project documentation
```

## Development Workflow

1. **Make Changes**: Edit your code
2. **Run Tests**: `npm test` to verify functionality
3. **Debug Issues**: Use `npm run test:debug` for detailed debugging
4. **Check Performance**: Use `npm run test:perf` for performance validation
5. **Deploy**: Push to repository (tests run automatically via GitHub Actions)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. **Run the test suite**: `npm test`
5. Ensure all tests pass
6. Submit a pull request

## CI/CD

- Automated testing runs on every push and pull request
- Tests run across multiple browsers and environments
- Test reports are automatically generated and stored
- Performance benchmarks are tracked over time

## License

MIT License