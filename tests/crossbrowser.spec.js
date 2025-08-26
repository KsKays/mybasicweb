const { test, expect, devices } = require('@playwright/test');

test.describe('Cross-Browser Compatibility Tests', () => {
  
  // Test with different browsers
  ['chromium', 'firefox', 'webkit'].forEach(browserName => {
    test(`should work correctly on ${browserName}`, async ({ page, browserName: currentBrowser }) => {
      test.skip(currentBrowser !== browserName, `Skipping ${browserName} test on ${currentBrowser}`);
      
      await page.setViewportSize({ width: 1280, height: 720 });
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Take browser-specific screenshot
      await page.screenshot({ 
        path: `test-results/browser-${browserName}-initial-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Test basic functionality
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('#registrationForm')).toBeVisible();
      
      // Test form interaction
      const testData = {
        name: `${browserName}User${Date.now()}`,
        email: `${browserName}${Date.now()}@test.com`,
        phone: '1234567890',
        country: 'Thailand'
      };
      
      await page.locator('#name').fill(testData.name);
      await page.locator('#email').fill(testData.email);
      await page.locator('#phone').fill(testData.phone);
      await page.selectOption('#country', testData.country);
      
      // Take screenshot of filled form
      await page.screenshot({ 
        path: `test-results/browser-${browserName}-filled-${Date.now()}.png` 
      });
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Verify success
      await expect(page.locator('#message')).toContainText('Registration successful');
      
      // Take final screenshot
      await page.screenshot({ 
        path: `test-results/browser-${browserName}-success-${Date.now()}.png` 
      });
    });
  });

  // Mobile device testing
  test('should work on mobile devices', async ({ browser }) => {
    const mobileDevices = [
      devices['iPhone 12'],
      devices['Pixel 5'],
      devices['iPhone SE'],
      devices['Galaxy S5']
    ];

    for (const device of mobileDevices) {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Take mobile device screenshot
      await page.screenshot({ 
        path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Test mobile-specific interactions
      await expect(page.locator('#registrationForm')).toBeVisible();
      await expect(page.locator('#registerBtn')).toBeVisible();
      
      // Test form filling on mobile
      await page.locator('#name').fill(`Mobile${Date.now()}`);
      await page.locator('#email').fill(`mobile${Date.now()}@test.com`);
      await page.locator('#phone').fill('1234567890');
      
      // Test select dropdown on mobile
      await page.selectOption('#country', 'Thailand');
      
      // Take filled form screenshot
      await page.screenshot({ 
        path: `test-results/mobile-${device.name.replace(/\s+/g, '-')}-filled-${Date.now()}.png` 
      });
      
      // Test submission
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Verify mobile submission works
      const message = await page.locator('#message').textContent();
      expect(message).toContain('Registration successful');
      
      await context.close();
    }
  });

  // Tablet testing
  test('should work on tablet devices', async ({ browser }) => {
    const tabletDevices = [
      devices['iPad Pro'],
      devices['iPad Mini'],
      { ...devices['Galaxy Tab S4'], name: 'Galaxy Tab S4' }
    ];

    for (const device of tabletDevices) {
      const context = await browser.newContext({
        ...device,
      });
      const page = await context.newPage();
      
      await page.goto('http://localhost:3000');
      await page.waitForLoadState('networkidle');
      
      // Take tablet screenshot
      await page.screenshot({ 
        path: `test-results/tablet-${device.name.replace(/\s+/g, '-')}-${Date.now()}.png`,
        fullPage: true 
      });
      
      // Test tablet-specific layout
      await expect(page.locator('#registrationForm')).toBeVisible();
      
      // Test form interaction on tablet
      await page.locator('#name').fill(`Tablet${Date.now()}`);
      await page.locator('#email').fill(`tablet${Date.now()}@test.com`);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'USA');
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      await expect(page.locator('#message')).toContainText('Registration successful');
      
      await context.close();
    }
  });

  // High DPI/Retina display testing
  test('should work on high DPI displays', async ({ browser }) => {
    const highDPIContext = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
      deviceScaleFactor: 2, // Simulate Retina display
    });
    
    const page = await highDPIContext.newPage();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take high DPI screenshot
    await page.screenshot({ 
      path: `test-results/highdpi-display-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Test that elements are still properly visible and functional
    await expect(page.locator('#registrationForm')).toBeVisible();
    await expect(page.locator('#registerBtn')).toBeVisible();
    
    // Test form functionality on high DPI
    await page.locator('#name').fill(`HighDPI${Date.now()}`);
    await page.locator('#email').fill(`highdpi${Date.now()}@test.com`);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Canada');
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    await highDPIContext.close();
  });

  // JavaScript disabled testing
  test('should handle JavaScript disabled scenarios gracefully', async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('domcontentloaded');
    
    // Take screenshot with JS disabled
    await page.screenshot({ 
      path: `test-results/no-javascript-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Basic HTML should still be functional
    await expect(page.locator('#registrationForm')).toBeVisible();
    await expect(page.locator('#registerBtn')).toBeVisible();
    
    // Form should still be submittable (basic HTML form submission)
    await page.locator('#name').fill(`NoJS${Date.now()}`);
    await page.locator('#email').fill(`nojs${Date.now()}@test.com`);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    // Note: Without JavaScript, client-side validation won't work,
    // but server-side should handle the form submission
    
    await context.close();
  });

  // Slow network simulation
  test('should work on slow network connections', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    
    // Simulate slow 3G connection
    await page.route('**/*', route => {
      setTimeout(() => route.continue(), 500); // Add 500ms delay to all requests
    });
    
    const startTime = Date.now();
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    const loadTime = Date.now() - startTime;
    
    // Take screenshot of slow network test
    await page.screenshot({ 
      path: `test-results/slow-network-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify page still loads and functions
    await expect(page.locator('#registrationForm')).toBeVisible();
    
    // Test form submission on slow network
    await page.locator('#name').fill(`SlowNet${Date.now()}`);
    await page.locator('#email').fill(`slownet${Date.now()}@test.com`);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(3000); // Wait longer for slow network
    
    const message = await page.locator('#message').textContent();
    expect(message).toBeTruthy();
    
    console.log(`Slow network load time: ${loadTime}ms`);
    
    await context.close();
  });

  // Cookie and local storage testing
  test('should handle cookie and storage restrictions', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      permissions: [], // No permissions granted
    });
    
    const page = await context.newPage();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take screenshot for storage test
    await page.screenshot({ 
      path: `test-results/storage-restrictions-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Application should still work without storage
    await expect(page.locator('#registrationForm')).toBeVisible();
    
    // Test basic functionality
    await page.locator('#name').fill(`NoStorage${Date.now()}`);
    await page.locator('#email').fill(`nostorage${Date.now()}@test.com`);
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    await expect(page.locator('#message')).toContainText('Registration successful');
    
    await context.close();
  });
});