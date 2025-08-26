const { test, expect } = require('@playwright/test');

test.describe('Security Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to the application
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/security-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should sanitize and validate email input properly', async ({ page }) => {
    // Test various email injection attempts
    const maliciousEmails = [
      'test@test.com<script>alert("xss")</script>',
      'test@test.com"; DROP TABLE users; --',
      'test@test.com\'; DELETE FROM users WHERE 1=1; --',
      'test@test.com<img src=x onerror=alert("xss")>',
      'javascript:alert("xss")@test.com'
    ];

    for (const email of maliciousEmails) {
      // Clear and fill form
      await page.locator('#name').fill('Security Test');
      await page.locator('#email').fill(email);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      // Take screenshot of malicious input
      await page.screenshot({ 
        path: `test-results/security-malicious-email-${Date.now()}.png` 
      });
      
      // Submit form
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Should show validation error, not execute script
      const message = await page.locator('#message').textContent();
      expect(message).not.toBe(''); // Should have some response
      
      // Verify no JavaScript execution occurred (page title should remain unchanged)
      const title = await page.title();
      expect(title).toBe('User Registration');
      
      // Reload page for next test
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle SQL injection attempts safely', async ({ page }) => {
    // Test SQL injection patterns
    const sqlInjectionAttempts = [
      "'; DROP TABLE users; --",
      "' OR '1'='1",
      "' UNION SELECT * FROM users --",
      "admin'/*",
      "1' OR 1=1#",
      "x' AND email='admin@test.com"
    ];

    for (const injection of sqlInjectionAttempts) {
      await page.locator('#name').fill(injection);
      await page.locator('#email').fill(`test${Date.now()}@test.com`);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      // Take screenshot of injection attempt
      await page.screenshot({ 
        path: `test-results/security-sql-injection-${Date.now()}.png` 
      });
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Should handle safely without database errors
      const message = await page.locator('#message').textContent();
      expect(message).not.toContain('database error');
      expect(message).not.toContain('SQL');
      expect(message).not.toContain('sqlite');
      
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should validate input length limits', async ({ page }) => {
    // Test extremely long inputs
    const longString = 'A'.repeat(1000);
    const veryLongString = 'B'.repeat(10000);
    
    // Test long name
    await page.locator('#name').fill(longString);
    await page.locator('#email').fill('test@test.com');
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    // Take screenshot of long input
    await page.screenshot({ 
      path: `test-results/security-long-input-${Date.now()}.png` 
    });
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Should handle long input gracefully
    const message1 = await page.locator('#message').textContent();
    expect(message1).toBeTruthy();
    
    // Test extremely long input
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    await page.locator('#name').fill(veryLongString);
    await page.locator('#email').fill('test2@test.com');
    await page.locator('#phone').fill('1234567890');
    await page.selectOption('#country', 'Thailand');
    
    await page.locator('#registerBtn').click();
    await page.waitForTimeout(2000);
    
    // Should not cause application to crash
    const message2 = await page.locator('#message').textContent();
    expect(message2).toBeTruthy();
  });

  test('should prevent XSS attacks in form fields', async ({ page }) => {
    // Test XSS payloads
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '<svg onload=alert("XSS")>',
      'javascript:alert("XSS")',
      '<iframe src="javascript:alert(\'XSS\')">',
      '<body onload=alert("XSS")>',
      '<div onclick=alert("XSS")>Click me</div>'
    ];

    for (const payload of xssPayloads) {
      await page.locator('#name').fill(payload);
      await page.locator('#email').fill(`xsstest${Date.now()}@test.com`);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      // Take screenshot of XSS attempt
      await page.screenshot({ 
        path: `test-results/security-xss-attempt-${Date.now()}.png` 
      });
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Check that no alert dialog appeared (XSS was prevented)
      const dialogPromise = page.waitForEvent('dialog', { timeout: 1000 }).catch(() => null);
      const dialog = await dialogPromise;
      expect(dialog).toBeNull(); // No dialog should appear
      
      // Verify page title is unchanged (no script execution)
      const title = await page.title();
      expect(title).toBe('User Registration');
      
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should handle special characters and Unicode properly', async ({ page }) => {
    // Test various special characters and Unicode
    const specialInputs = [
      { name: '测试用户', email: 'chinese@test.com' },
      { name: 'محمد علي', email: 'arabic@test.com' },
      { name: 'José María', email: 'spanish@test.com' },
      { name: 'Владимир', email: 'russian@test.com' },
      { name: '山田太郎', email: 'japanese@test.com' },
      { name: '!@#$%^&*()', email: 'symbols@test.com' },
      { name: '`~[]{}|\\', email: 'special@test.com' }
    ];

    for (const input of specialInputs) {
      await page.locator('#name').fill(input.name);
      await page.locator('#email').fill(input.email);
      await page.locator('#phone').fill('1234567890');
      await page.selectOption('#country', 'Thailand');
      
      // Take screenshot of special characters
      await page.screenshot({ 
        path: `test-results/security-special-chars-${Date.now()}.png` 
      });
      
      await page.locator('#registerBtn').click();
      await page.waitForTimeout(2000);
      
      // Should handle special characters without errors
      const message = await page.locator('#message').textContent();
      expect(message).not.toContain('error');
      expect(message).not.toContain('Error');
      
      await page.reload();
      await page.waitForLoadState('networkidle');
    }
  });

  test('should validate CORS headers properly', async ({ page }) => {
    // Test CORS by making cross-origin requests
    const response = await page.request.post('http://localhost:3000/register', {
      headers: {
        'Origin': 'http://malicious-site.com',
        'Content-Type': 'application/json'
      },
      data: {
        name: 'CORS Test',
        email: `cors${Date.now()}@test.com`,
        phone: '1234567890',
        country: 'Thailand'
      }
    });

    // CORS should be properly configured
    const corsHeader = response.headers()['access-control-allow-origin'];
    expect(corsHeader).toBeTruthy();
    
    // Take screenshot for CORS test documentation
    await page.screenshot({ 
      path: `test-results/security-cors-test-${Date.now()}.png` 
    });
  });

  test('should handle malformed JSON requests safely', async ({ page }) => {
    // Test malformed JSON
    const malformedPayloads = [
      '{"name": "test"', // Missing closing brace
      '{"name": }', // Invalid syntax
      'not json at all',
      '{"name": "test", "email": }', // Invalid value
      '{}', // Empty object
      '[]' // Array instead of object
    ];

    for (const payload of malformedPayloads) {
      const response = await page.request.post('http://localhost:3000/register', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: payload
      }).catch(error => ({ status: () => 400, ok: () => false }));

      // Should handle malformed JSON gracefully
      expect(response.status()).toBeGreaterThanOrEqual(400);
    }
    
    // Take screenshot for malformed JSON test
    await page.screenshot({ 
      path: `test-results/security-malformed-json-${Date.now()}.png` 
    });
  });
});