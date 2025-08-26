// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Registration Form Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the registration form
    await page.goto('/');
  });

  test('should load the registration form correctly', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/User Registration Form/);
    
    // Check main heading
    await expect(page.locator('h1')).toHaveText('User Registration');
    
    // Check all form fields are present
    await expect(page.locator('#name')).toBeVisible();
    await expect(page.locator('#gender')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#country')).toBeVisible();
    
    // Check submit button
    await expect(page.locator('button[type="submit"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toHaveText('Register');
  });

  test('should validate required fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toBeVisible();
    await expect(messageDiv).toHaveText(/Please fill in all fields/);
  });

  test('should validate email format', async ({ page }) => {
    // Fill form with invalid email
    await page.fill('#name', 'John Doe');
    await page.selectOption('#gender', 'male');
    await page.fill('#email', 'invalid-email');
    await page.selectOption('#country', 'usa');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for email validation error
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toBeVisible();
    await expect(messageDiv).toHaveText(/Please enter a valid email address/);
  });

  test('should successfully register a new user', async ({ page }) => {
    // Fill form with valid data
    await page.fill('#name', 'John Doe');
    await page.selectOption('#gender', 'male');
    await page.fill('#email', 'john.doe@example.com');
    await page.selectOption('#country', 'usa');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toBeVisible();
    await expect(messageDiv).toHaveText(/Registration successful/);
    
    // Check that form is reset after successful submission
    await expect(page.locator('#name')).toHaveValue('');
    await expect(page.locator('#email')).toHaveValue('');
  });

  test('should register Thai user with Thai name', async ({ page }) => {
    // Fill form with Thai name
    await page.fill('#name', 'สมศรี ใจดี');
    await page.selectOption('#gender', 'female');
    await page.fill('#email', 'somsri@example.com');
    await page.selectOption('#country', 'thailand');
    
    // Submit form
    await page.click('button[type="submit"]');
    
    // Check for success message
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toBeVisible();
    await expect(messageDiv).toHaveText(/Registration successful/);
  });

  test('should prevent duplicate email registration', async ({ page }) => {
    // Register first user
    await page.fill('#name', 'Jane Doe');
    await page.selectOption('#gender', 'female');
    await page.fill('#email', 'duplicate@example.com');
    await page.selectOption('#country', 'uk');
    await page.click('button[type="submit"]');
    
    // Wait for success message
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toHaveText(/Registration successful/);
    
    // Try to register with same email
    await page.fill('#name', 'Another User');
    await page.selectOption('#gender', 'male');
    await page.fill('#email', 'duplicate@example.com');
    await page.selectOption('#country', 'canada');
    await page.click('button[type="submit"]');
    
    // Check for duplicate email error
    await expect(messageDiv).toHaveText(/Email already registered/);
  });

  test('should have proper country options', async ({ page }) => {
    const countrySelect = page.locator('#country');
    
    // Check that Thailand is available
    await expect(countrySelect.locator('option[value="thailand"]')).toBeVisible();
    
    // Check that multiple countries are available
    const options = countrySelect.locator('option');
    const optionsCount = await options.count();
    expect(optionsCount).toBeGreaterThan(10); // Should have more than 10 country options
    
    // Check some specific countries
    await expect(countrySelect.locator('option[value="usa"]')).toBeVisible();
    await expect(countrySelect.locator('option[value="japan"]')).toBeVisible();
    await expect(countrySelect.locator('option[value="singapore"]')).toBeVisible();
  });

  test('should have responsive design', async ({ page }) => {
    // Test desktop view
    await page.setViewportSize({ width: 1280, height: 720 });
    await expect(page.locator('.container')).toBeVisible();
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.container')).toBeVisible();
    
    // Form should still be usable on mobile
    await page.fill('#name', 'Mobile User');
    await page.selectOption('#gender', 'other');
    await page.fill('#email', 'mobile@example.com');
    await page.selectOption('#country', 'thailand');
    
    const submitButton = page.locator('button[type="submit"]');
    await expect(submitButton).toBeVisible();
    await submitButton.click();
    
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toHaveText(/Registration successful/);
  });

  test('should show proper validation styling', async ({ page }) => {
    // Fill name field and blur to trigger validation
    await page.fill('#name', 'Test User');
    await page.click('#gender'); // Click elsewhere to blur name field
    
    // Check that valid field has success styling
    const nameField = page.locator('#name');
    const borderColor = await nameField.evaluate(el => window.getComputedStyle(el).borderColor);
    // Should have green border for valid field (rgb(40, 167, 69) is #28a745)
    expect(borderColor).toBe('rgb(40, 167, 69)');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Intercept the registration request and make it fail
    await page.route('/register', route => {
      route.abort('failed');
    });
    
    // Fill and submit form
    await page.fill('#name', 'Network Test');
    await page.selectOption('#gender', 'male');
    await page.fill('#email', 'network@example.com');
    await page.selectOption('#country', 'usa');
    await page.click('button[type="submit"]');
    
    // Check for network error message
    const messageDiv = page.locator('#message');
    await expect(messageDiv).toHaveText(/Network error. Please try again/);
  });
});