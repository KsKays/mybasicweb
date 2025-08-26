const { test, expect } = require('@playwright/test');

test.describe('SauceDemo E-commerce Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Configure test settings for video and screenshot recording
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // Navigate to the SauceDemo website
    await page.goto('https://www.saucedemo.com/');
    
    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Take initial screenshot
    await page.screenshot({ 
      path: `test-results/saucedemo-initial-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should complete full e-commerce flow from login to order completion', async ({ page }) => {
    // Verify initial page load
    await expect(page).toHaveTitle('Swag Labs');
    await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    
    // Take screenshot of login page
    await page.screenshot({ 
      path: `test-results/saucedemo-login-page-${Date.now()}.png` 
    });

    // Login with standard credentials
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.waitForTimeout(500);
    
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.waitForTimeout(500);
    
    // Take screenshot of filled login form
    await page.screenshot({ 
      path: `test-results/saucedemo-login-filled-${Date.now()}.png` 
    });
    
    // Click on Login button
    await page.locator('[data-test="login-button"]').click();
    
    // Wait for products page to load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    // Take screenshot of products page
    await page.screenshot({ 
      path: `test-results/saucedemo-products-page-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify successful login - products page should be visible
    await expect(page.locator('.title')).toHaveText('Products');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();

    // Add Product "Sauce Labs Backpack" Into the cart
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.waitForTimeout(1000);
    
    // Take screenshot after adding product
    await page.screenshot({ 
      path: `test-results/saucedemo-product-added-${Date.now()}.png` 
    });
    
    // Verify product was added (button text should change to "Remove")
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
    
    // Verify shopping cart badge shows 1 item
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

    // Open the cart
    await page.locator('.shopping_cart_link').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of cart page
    await page.screenshot({ 
      path: `test-results/saucedemo-cart-page-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify we're on the cart page and product is there
    await expect(page.locator('.title')).toHaveText('Your Cart');
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');

    // Click on Checkout button
    await page.locator('[data-test="checkout"]').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of checkout information page
    await page.screenshot({ 
      path: `test-results/saucedemo-checkout-info-${Date.now()}.png` 
    });
    
    // Verify we're on the checkout information page
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');

    // Fill Random data in First name, Last name and Zip
    const randomFirstName = `John${Math.floor(Math.random() * 1000)}`;
    const randomLastName = `Doe${Math.floor(Math.random() * 1000)}`;
    const randomZip = `${Math.floor(Math.random() * 90000) + 10000}`;
    
    await page.locator('[data-test="firstName"]').fill(randomFirstName);
    await page.waitForTimeout(500);
    
    await page.locator('[data-test="lastName"]').fill(randomLastName);
    await page.waitForTimeout(500);
    
    await page.locator('[data-test="postalCode"]').fill(randomZip);
    await page.waitForTimeout(500);
    
    // Take screenshot of filled checkout form
    await page.screenshot({ 
      path: `test-results/saucedemo-checkout-filled-${Date.now()}.png` 
    });

    // Click on continue button
    await page.locator('[data-test="continue"]').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of checkout overview page
    await page.screenshot({ 
      path: `test-results/saucedemo-checkout-overview-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify we're on the checkout overview page
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
    
    // Verify product details in overview
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99');

    // Click on finish button
    await page.locator('[data-test="finish"]').click();
    await page.waitForTimeout(2000);
    
    // Take screenshot of completion page
    await page.screenshot({ 
      path: `test-results/saucedemo-order-complete-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify message "Thank you for your order!"
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
    
    // Verify the success message description
    await expect(page.locator('.complete-text')).toContainText('Your order has been dispatched');
    
    // Take final success screenshot
    await page.screenshot({ 
      path: `test-results/saucedemo-success-final-${Date.now()}.png`,
      fullPage: true 
    });
  });

  test('should verify product details on products page', async ({ page }) => {
    // Login first
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForLoadState('networkidle');
    
    // Take screenshot of products
    await page.screenshot({ 
      path: `test-results/saucedemo-product-verification-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify Sauce Labs Backpack product details
    await expect(page.locator('[data-test="item-4-title-link"]')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('[data-test="item-4-desc"]')).toContainText('carry.allTheThings()');
    await expect(page.locator('[data-test="item-4-img-link"] img')).toBeVisible();
    
    // Verify price
    const backpackPrice = page.locator('.inventory_list .inventory_item').filter({ hasText: 'Sauce Labs Backpack' }).locator('.inventory_item_price');
    await expect(backpackPrice).toHaveText('$29.99');
  });

  test('should handle cart functionality correctly', async ({ page }) => {
    // Login first
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForLoadState('networkidle');
    
    // Initially cart should be empty
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    
    // Add multiple products to test cart functionality
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.waitForTimeout(1000);
    
    // Take screenshot with multiple items
    await page.screenshot({ 
      path: `test-results/saucedemo-multiple-items-${Date.now()}.png` 
    });
    
    // Verify cart badge shows 2 items
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    
    // Open cart and verify items
    await page.locator('.shopping_cart_link').click();
    await page.waitForTimeout(1000);
    
    // Take cart screenshot
    await page.screenshot({ 
      path: `test-results/saucedemo-cart-multiple-items-${Date.now()}.png`,
      fullPage: true 
    });
    
    // Verify both items are in cart
    await expect(page.locator('.cart_item')).toHaveCount(2);
  });

  test('should validate login form fields', async ({ page }) => {
    // Test empty form submission
    await page.locator('[data-test="login-button"]').click();
    await page.waitForTimeout(1000);
    
    // Take screenshot of error
    await page.screenshot({ 
      path: `test-results/saucedemo-login-error-${Date.now()}.png` 
    });
    
    // Verify error message for missing username
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    
    // Test with username only
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForTimeout(1000);
    
    // Verify error message for missing password
    await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
  });

  test('should complete checkout with different user data', async ({ page }) => {
    // Login
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await page.waitForLoadState('networkidle');
    
    // Add product and proceed to checkout
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    
    // Fill with different random data
    const testData = {
      firstName: `Alice${Math.floor(Math.random() * 1000)}`,
      lastName: `Smith${Math.floor(Math.random() * 1000)}`,
      zipCode: `${Math.floor(Math.random() * 90000) + 10000}`
    };
    
    await page.locator('[data-test="firstName"]').fill(testData.firstName);
    await page.locator('[data-test="lastName"]').fill(testData.lastName);
    await page.locator('[data-test="postalCode"]').fill(testData.zipCode);
    
    // Take screenshot of different user data
    await page.screenshot({ 
      path: `test-results/saucedemo-different-user-data-${Date.now()}.png` 
    });
    
    // Continue checkout
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await page.waitForTimeout(2000);
    
    // Verify successful completion
    await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    
    // Take final screenshot
    await page.screenshot({ 
      path: `test-results/saucedemo-alternate-success-${Date.now()}.png`,
      fullPage: true 
    });
  });
});