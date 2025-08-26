const { test, expect } = require('@playwright/test');

test.describe('Performance and Load Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/performance-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should load main page within acceptable time limits', async ({ page }) => {
    const startTime = Date.now();
    
    // Navigate to page and measure load time
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Take screenshot of loaded page
    await page.screenshot({ 
      path: `test-results/performance-page-loaded-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify page loads within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Verify critical elements are visible
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('#registrationForm')).toBeVisible();
    await expect(page.locator('#registerBtn')).toBeVisible();
    
    console.log(`Page load time: ${loadTime}ms`);
  });

  test('should handle multiple rapid form submissions efficiently', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const submissions = [];
    const startTime = Date.now();
    
    // Perform multiple rapid submissions
    for (let i = 0; i < 5; i++) {
      const submitStart = Date.now();
      
      await page.locator('#name').fill(`LoadTest${i}_${Date.now()}`);
      await page.locator('#email').fill(`load${i}_${Date.now()}@test.com`);
      await page.locator('#phone').fill(`12345${i}${Date.now().toString().slice(-4)}`);
      await page.selectOption('#country', 'Thailand');
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(1000);
      
      const submitTime = Date.now() - submitStart;
      submissions.push(submitTime);
      
      // Reload page for next submission
      if (i < 4) {
        await page.reload();
        await page.waitForLoadState('networkidle');
      }
    }
    
    const totalTime = Date.now() - startTime;
    
    // Take screenshot of final state
    await page.screenshot({ 
      path: `test-results/performance-multiple-submissions-${Date.now()}.png` 
    });
    
    // Verify each submission completed within reasonable time
    submissions.forEach((time, index) => {
      expect(time).toBeLessThan(5000); // Each submission should take less than 5 seconds
      console.log(`Submission ${index + 1}: ${time}ms`);
    });
    
    console.log(`Total time for 5 submissions: ${totalTime}ms`);
    console.log(`Average submission time: ${submissions.reduce((a, b) => a + b, 0) / submissions.length}ms`);
  });

  test('should handle API endpoints performance', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Test multiple API calls
    const apiTests = [
      { endpoint: '/users', name: 'Get Users' },
      { endpoint: '/users/count', name: 'Get Users Count' }
    ];
    
    for (const apiTest of apiTests) {
      const startTime = Date.now();
      
      const response = await page.request.get(`http://localhost:3000${apiTest.endpoint}`);
      
      const responseTime = Date.now() - startTime;
      
      expect(response.ok()).toBeTruthy();
      expect(responseTime).toBeLessThan(2000); // API should respond within 2 seconds
      
      console.log(`${apiTest.name} response time: ${responseTime}ms`);
    }
    
    // Take screenshot of API testing
    await page.screenshot({ 
      path: `test-results/performance-api-test-${Date.now()}.png` 
    });
  });

  test('should handle concurrent user registrations', async ({ browser }) => {
    // Create multiple browser contexts to simulate concurrent users
    const contexts = [];
    const pages = [];
    
    // Create 3 concurrent browser contexts
    for (let i = 0; i < 3; i++) {
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 }
      });
      const page = await context.newPage();
      contexts.push(context);
      pages.push(page);
    }
    
    const startTime = Date.now();
    
    // Perform concurrent registrations
    const registrationPromises = pages.map(async (page, index) => {
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      const timestamp = Date.now();
      await page.locator('#name').fill(`ConcurrentUser${index}_${timestamp}`);
      await page.locator('#email').fill(`concurrent${index}_${timestamp}@test.com`);
      await page.locator('#phone').fill(`555${index}${timestamp.toString().slice(-6)}`);
      await page.selectOption('#country', 'Thailand');
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Take screenshot for each concurrent user
      await page.screenshot({ 
        path: `test-results/performance-concurrent-user${index}-${Date.now()}.png` 
      });
      
      return page.locator('#message').textContent();
    });
    
    // Wait for all registrations to complete
    const results = await Promise.all(registrationPromises);
    const totalTime = Date.now() - startTime;
    
    // Verify all registrations were successful
    results.forEach((result, index) => {
      expect(result).toContain('Registration successful');
      console.log(`Concurrent user ${index + 1}: Success`);
    });
    
    console.log(`Total time for 3 concurrent registrations: ${totalTime}ms`);
    
    // Clean up contexts
    for (const context of contexts) {
      await context.close();
    }
  });

  test('should maintain responsive design under load', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(1000);
      
      // Take screenshot for each viewport
      await page.screenshot({ 
        path: `test-results/performance-responsive-${viewport.name}-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Verify key elements are still visible and functional
      await expect(page.locator('#registrationForm')).toBeVisible();
      await expect(page.locator('#registerBtn')).toBeVisible();
      
      // Test form interaction
      await page.locator('#name').fill(`ResponsiveTest_${viewport.name}`);
      await page.locator('#name').clear(); // Clear for next viewport test
      
      console.log(`Responsive test passed for ${viewport.name} (${viewport.width}x${viewport.height})`);
    }
  });
});