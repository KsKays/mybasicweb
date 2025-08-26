# Testing Documentation - MyBasicWeb Registration System

## 🎭 Playwright Test Suite

This project uses **Playwright** for comprehensive end-to-end testing of the registration form system.

### 📋 Test Coverage

Our test suite covers the following areas:

#### 1. **Registration Form Tests** (`registration-form.spec.js`)
- ✅ Form loading and element visibility
- ✅ Required field validation
- ✅ Email format validation  
- ✅ Successful user registration
- ✅ Thai language support
- ✅ Duplicate email prevention
- ✅ Country selection options
- ✅ Responsive design testing
- ✅ Form validation styling
- ✅ Network error handling

#### 2. **API Endpoint Tests** (`api-endpoints.spec.js`)
- ✅ GET / (main page serving)
- ✅ POST /register (user registration)
- ✅ GET /users (user data retrieval)
- ✅ GET /users/count (user count)
- ✅ Invalid data handling
- ✅ Email format validation
- ✅ Duplicate email prevention
- ✅ Thai character support
- ✅ CORS handling

#### 3. **Visual & Accessibility Tests** (`visual-accessibility.spec.js`)
- ✅ CSS styling verification
- ✅ Button hover effects
- ✅ Keyboard navigation
- ✅ Form label associations
- ✅ Required field attributes
- ✅ Visual regression testing
- ✅ Responsive breakpoints
- ✅ Color contrast compliance
- ✅ Focus state handling

#### 4. **Database Integration Tests** (`database-integration.spec.js`)
- ✅ Data persistence across restarts
- ✅ Concurrent registration handling
- ✅ Data integrity with invalid inputs
- ✅ Unicode/special character support
- ✅ Email uniqueness constraint
- ✅ Correct data ordering
- ✅ Error handling

#### 5. **Performance & Load Tests** (`performance-load.spec.js`)
- ✅ Page load performance
- ✅ Form submission speed
- ✅ Multiple rapid registrations
- ✅ Large payload handling
- ✅ Concurrent database reads
- ✅ CSS/JavaScript loading times
- ✅ Form validation performance
- ✅ Memory efficiency testing
- ✅ Database query performance

### 🚀 Running Tests

#### Prerequisites
```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

#### Test Commands

```bash
# Run all tests
npm test

# Run tests with browser UI (headed mode)
npm run test:headed

# Run tests with Playwright UI (interactive mode)
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test tests/registration-form.spec.js

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox  
npx playwright test --project=webkit
```

#### Test Reports

```bash
# View HTML test report
npx playwright show-report
```

### 🌐 Browser Support

Tests run on multiple browsers:
- **Chromium** (Chrome/Edge)
- **Firefox**
- **WebKit** (Safari)
- **Mobile Chrome** (Pixel 5)
- **Mobile Safari** (iPhone 12)

### 🔧 Configuration

Test configuration is defined in `playwright.config.js`:

- **Base URL**: http://localhost:3000
- **Test Directory**: ./tests
- **Parallel Execution**: Enabled
- **Retries**: 2 on CI, 0 locally
- **Timeout**: 60 minutes for CI
- **Screenshots**: On failure only
- **Videos**: Retained on failure
- **Traces**: On first retry

### 📊 Test Scenarios

#### Multi-language Testing
- English form labels and validation
- Thai name input: "สมศรี ใจดี"
- Unicode character support
- Special characters in names

#### Form Validation Scenarios
```javascript
// Valid registration
{
  name: "John Doe",
  gender: "male", 
  email: "john@example.com",
  country: "usa"
}

// Invalid email formats tested
- "invalid-email"
- ""
- "missing@domain"
- "domain.com"
```

#### Performance Benchmarks
- Page load: < 3 seconds
- Form submission: < 2 seconds
- 10 rapid registrations: < 5 seconds
- Database queries with 50+ users: < 1 second
- Real-time validation: < 500ms

#### Error Handling
- Network failures
- Database connection issues
- Invalid input data
- Missing required fields
- Duplicate email attempts

### 🎯 Test Data Management

Tests use unique email addresses to prevent conflicts:
- `test@example.com`
- `somsri@example.com` (Thai user)
- `duplicate@example.com` (duplicate testing)
- `performance@example.com` (performance testing)

### 📈 Continuous Integration

GitHub Actions workflow (`.github/workflows/playwright.yml`):
- Runs on push to main/develop branches
- Runs on pull requests
- Uploads test reports and artifacts
- Supports multiple Node.js versions
- Timeout protection (60 minutes)

### 🐛 Debugging Tests

#### Local Debugging
```bash
# Run in debug mode (opens browser DevTools)
npm run test:debug

# Run with headed browser to see actions
npm run test:headed

# Run specific test with debugging
npx playwright test tests/registration-form.spec.js --debug
```

#### Test Artifacts
- Screenshots on failure
- Videos on failure  
- Traces on retry
- HTML reports with detailed results

### 📝 Writing New Tests

#### Test Structure
```javascript
const { test, expect } = require('@playwright/test');

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should do something', async ({ page }) => {
    // Test implementation
    await expect(page.locator('#element')).toBeVisible();
  });
});
```

#### Best Practices
1. Use descriptive test names
2. Group related tests in describe blocks
3. Use beforeEach for common setup
4. Assert on visible elements only
5. Use proper locators (ID > CSS > XPath)
6. Handle async operations properly
7. Clean up test data when needed

### 🔍 Test Maintenance

#### Regular Tasks
- Update browser versions
- Review test performance
- Add tests for new features
- Remove obsolete tests
- Update test data

#### Monitoring
- Test execution times
- Failure rates by browser
- Coverage metrics
- Performance regression

### 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Test Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)
- [CI/CD Integration](https://playwright.dev/docs/ci)

---

**Last Updated**: August 26, 2025  
**Playwright Version**: ^1.40.0  
**Test Files**: 5 files, 50+ test cases  
**Coverage**: Frontend, Backend, Database, Performance, Visual