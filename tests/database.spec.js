const { test, expect } = require('@playwright/test');

test.describe('Database Operations Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings for video and screenshot recording
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to the registration form
    await page.goto('http://localhost:3000');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/database-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should handle database persistence and retrieval correctly', async ({ page }) => {
    // Generate unique test data
    const timestamp = Date.now();
    const testUser = {
      name: `TestUser${timestamp}`,
      email: `test${timestamp}@example.com`,
      phone: `555${timestamp.toString().slice(-7)}`,
      country: 'Thailand'
    };

    // Fill registration form
    await page.locator('#name').fill(testUser.name);
    await page.locator('#email').fill(testUser.email);
    await page.locator('#phone').fill(testUser.phone);
    await page.selectOption('#country', testUser.country);
    
    // Take screenshot of filled form
    await page.screenshot({ 
      path: `test-results/database-form-filled-${Date.now()}.png` 
    });

    // Submit form
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of success response
    await page.screenshot({ 
      path: `test-results/database-registration-success-${Date.now()}.png` 
    });

    // Verify success message
    await expect(page.locator('#message')).toContainText('Registration successful');

    // Test data retrieval by making API call
    const response = await page.request.get('http://localhost:3000/users');
    expect(response.ok()).toBeTruthy();
    
    const users = await response.json();
    expect(users).toBeInstanceOf(Array);
    
    // Verify our user exists in the database
    const ourUser = users.find(user => user.email === testUser.email);
    expect(ourUser).toBeTruthy();
    expect(ourUser.name).toBe(testUser.name);
    expect(ourUser.phone).toBe(testUser.phone);
    expect(ourUser.country).toBe(testUser.country);
  });

  test('should prevent duplicate email registrations', async ({ page }) => {
    const duplicateEmail = `duplicate${Date.now()}@test.com`;
    
    // First registration
    await page.locator('#name').fill('First User');
    await page.locator('#email').fill(duplicateEmail);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'USA');
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of first registration
    await page.screenshot({ 
      path: `test-results/database-first-registration-${Date.now()}.png` 
    });
    
    // Verify first registration success
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    // Reload page for second attempt
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Attempt duplicate registration
    await page.locator('#name').fill('Second User');
    await page.locator('#email').fill(duplicateEmail);
    await page.locator('#phone').fill('0987654321');
    await page.selectOption('#country', 'Canada');
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of duplicate attempt
    await page.screenshot({ 
      path: `test-results/database-duplicate-attempt-${Date.now()}.png` 
    });
    
    // Verify duplicate prevention
    await expect(page.locator('#message')).toContainText('Email already exists');
  });

  test('should handle user count API endpoint', async ({ page }) => {
    // Test user count endpoint
    const countResponse = await page.request.get('http://localhost:3000/users/count');
    expect(countResponse.ok()).toBeTruthy();
    
    const countData = await countResponse.json();
    expect(countData).toHaveProperty('count');
    expect(typeof countData.count).toBe('number');
    expect(countData.count).toBeGreaterThanOrEqual(0);
    
    // Take screenshot for API testing
    await page.screenshot({ 
      path: `test-results/database-api-test-${Date.now()}.png` 
    });
  });

  test('should handle Thai characters in database storage', async ({ page }) => {
    const thaiUser = {
      name: 'สมชาย ใจดี',
      email: `thai${Date.now()}@example.com`,
      phone: '0812345678',
      country: 'Thailand'
    };

    // Fill form with Thai characters
    await page.locator('#name').fill(thaiUser.name);
    await page.locator('#email').fill(thaiUser.email);
    await page.locator('#phone').fill(thaiUser.phone);
    await page.selectOption('#country', thaiUser.country);
    
    // Take screenshot of Thai input
    await page.screenshot({ 
      path: `test-results/database-thai-input-${Date.now()}.png` 
    });

    // Submit form
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Verify success
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    // Verify Thai characters are stored correctly
    const response = await page.request.get('http://localhost:3000/users');
    const users = await response.json();
    const thaiUserStored = users.find(user => user.email === thaiUser.email);
    
    expect(thaiUserStored).toBeTruthy();
    expect(thaiUserStored.name).toBe(thaiUser.name);
    
    // Take screenshot of success
    await page.screenshot({ 
      path: `test-results/database-thai-success-${Date.now()}.png` 
    });
  });
});