const { test, expect } = require('@playwright/test');

test.describe('Coffee Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings for video and screenshot recording
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to the coffee cart website
    await page.goto('https://seleniumbase.io/coffee/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/coffee-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should order 1 Espresso and 1 Mocha and complete payment', async ({ page }) => {
    // Verify initial page load
    await expect(page).toHaveTitle('Coffee Cart');
    await expect(page.getByText('cart (0)')).toBeVisible();
    await expect(page.getByText('Total: $0.00')).toBeVisible();
    
    // Take screenshot of menu
    await page.screenshot({ 
      path: `test-results/coffee-menu-${Date.now()}.png`,
      fullPage: true 
    });

    // Order 1 Espresso ($10.00)
    await page.getByText('Espresso $10.00espresso').click();
    
    // Wait for animation and take screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `test-results/coffee-espresso-added-${Date.now()}.png` 
    });
    
    // Verify Espresso added to cart
    await expect(page.getByText('cart (1)')).toBeVisible();
    await expect(page.getByText('Total: $10.00')).toBeVisible();

    // Order 1 Mocha ($8.00)
    await page.getByText('Mocha $8.00espressochocolate').click();
    
    // Wait for animation and take screenshot
    await page.waitForTimeout(1000);
    await page.screenshot({ 
      path: `test-results/coffee-both-items-added-${Date.now()}.png` 
    });
    
    // Verify both items added to cart
    await expect(page.getByText('cart (2)')).toBeVisible();
    await expect(page.getByText('Total: $18.00')).toBeVisible();

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Wait for payment form and take screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: `test-results/coffee-payment-form-${Date.now()}.png` 
    });
    
    // Verify payment form appears
    await expect(page.getByText('Payment details')).toBeVisible();
    await expect(page.getByText('We will send you a payment link via email.')).toBeVisible();

    // Fill in payment details
    await page.getByRole('textbox', { name: 'Name' }).fill('kays');
    await page.waitForTimeout(500);
    
    await page.getByRole('textbox', { name: 'Email' }).fill('kays@gmail.com');
    await page.waitForTimeout(500);
    
    // Check promotional checkbox
    await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
    await page.waitForTimeout(500);
    
    // Take screenshot of filled form
    await page.screenshot({ 
      path: `test-results/coffee-form-filled-${Date.now()}.png` 
    });
    
    // Verify form fields are filled correctly
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('kays');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('kays@gmail.com');
    await expect(page.getByRole('checkbox', { name: 'Promotion checkbox' })).toBeChecked();

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Wait for success message and take final screenshot
    await page.waitForTimeout(2000);
    await page.screenshot({ 
      path: `test-results/coffee-success-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify success message
    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
    
    // Verify cart is reset after successful payment
    await expect(page.getByText('cart (0)')).toBeVisible();
    await expect(page.getByText('Total: $0.00')).toBeVisible();
  });

  test('should calculate correct total for individual items', async ({ page }) => {
    // Test individual item pricing
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/coffee-pricing-test-start-${Date.now()}.png` 
    });
    
    // Add Espresso and verify price
    await page.getByText('Espresso $10.00espresso').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Total: $10.00')).toBeVisible();
    
    // Screenshot after Espresso
    await page.screenshot({ 
      path: `test-results/coffee-espresso-only-${Date.now()}.png` 
    });
    
    // Add Mocha and verify cumulative price
    await page.getByText('Mocha $8.00espressochocolate').click();
    await page.waitForTimeout(1000);
    await expect(page.getByText('Total: $18.00')).toBeVisible();
    
    // Screenshot after both items
    await page.screenshot({ 
      path: `test-results/coffee-both-items-pricing-${Date.now()}.png` 
    });
    
    // Verify cart count
    await expect(page.getByText('cart (2)')).toBeVisible();
  });

  test('should display payment form when proceeding to checkout', async ({ page }) => {
    // Add items to cart first
    await page.getByText('Espresso $10.00espresso').click();
    await page.getByText('Mocha $8.00espressochocolate').click();
    await page.waitForTimeout(1000);
    
    // Screenshot before checkout
    await page.screenshot({ 
      path: `test-results/coffee-before-checkout-${Date.now()}.png` 
    });
    
    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    await page.waitForTimeout(2000);
    
    // Screenshot of payment form
    await page.screenshot({ 
      path: `test-results/coffee-payment-form-display-${Date.now()}.png` 
    });
    
    // Verify all payment form elements are present
    await expect(page.getByText('Payment details')).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Name' })).toBeVisible();
    await expect(page.getByRole('textbox', { name: 'Email' })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: 'Promotion checkbox' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit' })).toBeVisible();
    await expect(page.getByText('I would like to receive order updates and promotional messages.')).toBeVisible();
  });

  test('should validate form submission with required fields', async ({ page }) => {
    // Add items and proceed to checkout
    await page.getByText('Espresso $10.00espresso').click();
    await page.locator('[data-test="checkout"]').click();
    await page.waitForTimeout(2000);
    
    // Screenshot of empty form
    await page.screenshot({ 
      path: `test-results/coffee-empty-form-${Date.now()}.png` 
    });
    
    // Fill form with valid data
    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.waitForTimeout(500);
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.waitForTimeout(500);
    await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
    await page.waitForTimeout(500);
    
    // Screenshot of filled form
    await page.screenshot({ 
      path: `test-results/coffee-filled-form-validation-${Date.now()}.png` 
    });
    
    // Submit and verify success
    await page.getByRole('button', { name: 'Submit' }).click();
    await page.waitForTimeout(2000);
    
    // Screenshot of success
    await page.screenshot({ 
      path: `test-results/coffee-validation-success-${Date.now()}.png`,
      fullPage: true 
    });
    
    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
  });

  test('should display correct menu items and prices', async ({ page }) => {
    // Take full menu screenshot
    await page.screenshot({ 
      path: `test-results/coffee-full-menu-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify all menu items are displayed with correct prices
    await expect(page.getByText('Espresso $10.00')).toBeVisible();
    await expect(page.getByText('Espresso Macchiato $12.00')).toBeVisible();
    await expect(page.getByText('Cappuccino $19.00')).toBeVisible();
    await expect(page.getByText('Mocha $8.00')).toBeVisible();
    await expect(page.getByText('Flat White $18.00')).toBeVisible();
    await expect(page.getByText('Americano $7.00')).toBeVisible();
    await expect(page.getByText('Cafe Latte $16.00')).toBeVisible();
    await expect(page.getByText('Espresso Con Panna $14.00')).toBeVisible();
    await expect(page.getByText('Cafe Breve $15.00')).toBeVisible();
    
    // Take another screenshot after verification
    await page.screenshot({ 
      path: `test-results/coffee-menu-verified-${Date.now()}.png` 
    });
  });
});