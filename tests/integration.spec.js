const { test, expect } = require('@playwright/test');

test.describe('Integration Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/integration-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should complete full user registration workflow', async ({ page }) => {
    // Step 1: Navigate to application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of landing page
    await page.screenshot({ 
      path: `test-results/integration-landing-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Step 2: Verify initial state
    await expect(page.locator('h1')).toContainText('User Registration');
    await expect(page.locator('#registrationForm')).toBeVisible();
    await expect(page.locator('#message')).toBeEmpty();
    
    // Step 3: Fill registration form
    const userData = {
      name: `IntegrationUser${Date.now()}`,
      email: `integration${Date.now()}@test.com`,
      phone: `555${Date.now().toString().slice(-7)}`,
      country: 'Thailand'
    };
    
    await page.locator('#name').fill(userData.name);
    await page.locator('#email').fill(userData.email);
    await page.locator('#phone').fill(userData.phone);
    await page.selectOption('#country', userData.country);
    
    // Take screenshot of filled form
    await page.screenshot({ 
      path: `test-results/integration-form-filled-${Date.now()}.png` 
    });
    
    // Step 4: Submit form and verify response
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of submission result
    await page.screenshot({ 
      path: `test-results/integration-submission-${Date.now()}.png` 
    });
    
    // Verify success message
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    // Step 5: Verify data persistence via API
    const usersResponse = await page.request.get('http://localhost:3000/users');
    expect(usersResponse.ok()).toBeTruthy();
    
    const users = await usersResponse.json();
    const registeredUser = users.find(user => user.email === userData.email);
    
    expect(registeredUser).toBeTruthy();
    expect(registeredUser.name).toBe(userData.name);
    expect(registeredUser.phone).toBe(userData.phone);
    expect(registeredUser.country).toBe(userData.country);
    
    // Step 6: Verify user count increased
    const countResponse = await page.request.get('http://localhost:3000/users/count');
    const countData = await countResponse.json();
    expect(countData.count).toBeGreaterThan(0);
    
    // Take final verification screenshot
    await page.screenshot({ 
      path: `test-results/integration-complete-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should handle multiple user registrations in sequence', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const users = [
      { name: 'User One', email: `user1_${Date.now()}@test.com`, phone: '1111111111', country: 'Thailand' },
      { name: 'User Two', email: `user2_${Date.now()}@test.com`, phone: '2222222222', country: 'USA' },
      { name: 'User Three', email: `user3_${Date.now()}@test.com`, phone: '3333333333', country: 'Canada' }
    ];
    
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      
      // Fill form
      await page.locator('#name').fill(user.name);
      await page.locator('#email').fill(user.email);
      await page.locator('#phone').fill(user.phone);
      await page.selectOption('#country', user.country);
      
      // Take screenshot for each user
      await page.screenshot({ 
        path: `test-results/integration-sequential-user${i + 1}-${Date.now()}.png` 
      });
      
      // Submit
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Verify success
      await expect(page.locator('#message')).toContainText('Registration successful');
      
      // Clear form for next user (reload page)
      if (i < users.length - 1) {
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Verify all users were registered
    const usersResponse = await page.request.get('http://localhost:3000/users');
    const allUsers = await usersResponse.json();
    
    for (const user of users) {
      const foundUser = allUsers.find(u => u.email === user.email);
      expect(foundUser).toBeTruthy();
      expect(foundUser.name).toBe(user.name);
    }
    
    // Take final screenshot
    await page.screenshot({ 
      path: `test-results/integration-sequential-complete-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should integrate with external systems simulation', async ({ page }) => {
    // Simulate integration with external email service
    let emailSent = false;
    
    // Mock external API call
    await page.route('**/send-email', route => {
      emailSent = true;
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, messageId: 'email-123' })
      });
    });
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Register user
    await page.locator('#name').fill(`ExternalTest${Date.now()}`);
    await page.locator('#email').fill(`external${Date.now()}@test.com`);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    // Take screenshot before integration
    await page.screenshot({ 
      path: `test-results/integration-external-before-${Date.now()}.png` 
    });
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Verify registration succeeded
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    // Take screenshot after integration
    await page.screenshot({ 
      path: `test-results/integration-external-after-${Date.now()}.png` 
    });
    
    // Note: In a real scenario, you might verify email was sent
    // For this test, we just verify the registration flow completed
  });

  test('should handle error scenarios and recovery', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test 1: Invalid email format
    await page.locator('#name').fill('Error Test User');
    await page.locator('#email').fill('invalid-email');
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    // Take screenshot of invalid input
    await page.screenshot({ 
      path: `test-results/integration-error-invalid-email-${Date.now()}.png` 
    });
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Should show validation error
    const errorMessage = await page.locator('#message').textContent();
    expect(errorMessage).toContain('valid email');
    
    // Test 2: Recovery with valid data
    await page.locator('#email').clear();
    await page.locator('#email').fill(`recovery${Date.now()}@test.com`);
    
    // Take screenshot of corrected input
    await page.screenshot({ 
      path: `test-results/integration-error-recovery-${Date.now()}.png` 
    });
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Should now succeed
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    // Test 3: Duplicate email handling
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    // Try to register same email again
    await page.locator('#name').fill('Duplicate User');
    await page.locator('#email').fill(`recovery${Date.now()}@test.com`);
    await page.locator('#phone').fill('0987654321');
    await page.selectOption('#country', 'USA');
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Should prevent duplicate
    await expect(page.locator('#message')).toContainText('Email already exists');
    
    // Take final error handling screenshot
    await page.screenshot({ 
      path: `test-results/integration-error-duplicate-${Date.now()}.png` 
    });
  });

  test('should maintain data consistency across operations', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Get initial user count
    const initialCountResponse = await page.request.get('http://localhost:3000/users/count');
    const initialCount = (await initialCountResponse.json()).count;
    
    // Register multiple users
    const testUsers = [
      { name: 'Consistency User 1', email: `consist1_${Date.now()}@test.com` },
      { name: 'Consistency User 2', email: `consist2_${Date.now()}@test.com` },
      { name: 'Consistency User 3', email: `consist3_${Date.now()}@test.com` }
    ];
    
    for (const user of testUsers) {
      await page.locator('#name').fill(user.name);
      await page.locator('#email').fill(user.email);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      await expect(page.locator('#message')).toContainText('Registration successful');
      
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
    
    // Verify final count
    const finalCountResponse = await page.request.get('http://localhost:3000/users/count');
    const finalCount = (await finalCountResponse.json()).count;
    
    expect(finalCount).toBe(initialCount + testUsers.length);
    
    // Verify all users exist in database
    const usersResponse = await page.request.get('http://localhost:3000/users');
    const allUsers = await usersResponse.json();
    
    for (const testUser of testUsers) {
      const foundUser = allUsers.find(u => u.email === testUser.email);
      expect(foundUser).toBeTruthy();
      expect(foundUser.name).toBe(testUser.name);
    }
    
    // Take consistency verification screenshot
    await page.screenshot({ 
      path: `test-results/integration-consistency-verified-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should handle concurrent operations correctly', async ({ browser }) => {
    // Create multiple browser contexts for concurrent testing
    const contexts = [];
    const pages = [];
    
    for (let i = 0; i < 3; i++) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
      });
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
      
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
    }
    
    // Perform concurrent registrations
    const concurrentUsers = [
      { name: 'Concurrent User 1', email: `concurrent1_${Date.now()}@test.com` },
      { name: 'Concurrent User 2', email: `concurrent2_${Date.now()}@test.com` },
      { name: 'Concurrent User 3', email: `concurrent3_${Date.now()}@test.com` }
    ];
    
    const registrationPromises = pages.map(async (page, index) => {
      const user = concurrentUsers[index];
      
      await page.locator('#name').fill(user.name);
      await page.locator('#email').fill(user.email);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      // Take screenshot for each concurrent operation
      await page.screenshot({ 
        path: `test-results/integration-concurrent-${index + 1}-${Date.now()}.png` 
      });
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      return page.locator('#message').textContent();
    });
    
    // Wait for all concurrent operations to complete
    const results = await Promise.all(registrationPromises);
    
    // Verify all succeeded
    results.forEach((result, index) => {
      expect(result).toContain('Registration successful');
      console.log(`Concurrent registration ${index + 1}: Success`);
    });
    
    // Verify data consistency after concurrent operations
    const finalPage = pages[0];
    const usersResponse = await finalPage.request.get('http://localhost:3000/users');
    const allUsers = await usersResponse.json();
    
    for (const user of concurrentUsers) {
      const foundUser = allUsers.find(u => u.email === user.email);
      expect(foundUser).toBeTruthy();
    }
    
    // Clean up contexts
    for (const context of contexts) {
      await context.close();
    }
  });
});