const { test, expect } = require('@playwright/test');

test.describe('Coffee Cart Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the coffee cart website
    await page.goto('https://seleniumbase.io/coffee/');
  });

  test('should order 1 Espresso and 1 Mocha and complete payment', async ({ page }) => {
    // Verify initial page load
    await expect(page).toHaveTitle('Coffee Cart');
    await expect(page.getByText('cart (0)')).toBeVisible();
    await expect(page.getByText('Total: $0.00')).toBeVisible();

    // Order 1 Espresso ($10.00)
    await page.getByText('Espresso $10.00espresso').click();
    
    // Verify Espresso added to cart
    await expect(page.getByText('cart (1)')).toBeVisible();
    await expect(page.getByText('Total: $10.00')).toBeVisible();

    // Order 1 Mocha ($8.00)
    await page.getByText('Mocha $8.00espressochocolate').click();
    
    // Verify both items added to cart
    await expect(page.getByText('cart (2)')).toBeVisible();
    await expect(page.getByText('Total: $18.00')).toBeVisible();

    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    
    // Verify payment form appears
    await expect(page.getByText('Payment details')).toBeVisible();
    await expect(page.getByText('We will send you a payment link via email.')).toBeVisible();

    // Fill in payment details
    await page.getByRole('textbox', { name: 'Name' }).fill('kays');
    await page.getByRole('textbox', { name: 'Email' }).fill('kays@gmail.com');
    
    // Check promotional checkbox
    await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
    
    // Verify form fields are filled correctly
    await expect(page.getByRole('textbox', { name: 'Name' })).toHaveValue('kays');
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('kays@gmail.com');
    await expect(page.getByRole('checkbox', { name: 'Promotion checkbox' })).toBeChecked();

    // Submit the form
    await page.getByRole('button', { name: 'Submit' }).click();
    
    // Verify success message
    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
    
    // Verify cart is reset after successful payment
    await expect(page.getByText('cart (0)')).toBeVisible();
    await expect(page.getByText('Total: $0.00')).toBeVisible();
  });

  test('should calculate correct total for individual items', async ({ page }) => {
    // Test individual item pricing
    
    // Add Espresso and verify price
    await page.getByText('Espresso $10.00espresso').click();
    await expect(page.getByText('Total: $10.00')).toBeVisible();
    
    // Add Mocha and verify cumulative price
    await page.getByText('Mocha $8.00espressochocolate').click();
    await expect(page.getByText('Total: $18.00')).toBeVisible();
    
    // Verify cart count
    await expect(page.getByText('cart (2)')).toBeVisible();
  });

  test('should display payment form when proceeding to checkout', async ({ page }) => {
    // Add items to cart first
    await page.getByText('Espresso $10.00espresso').click();
    await page.getByText('Mocha $8.00espressochocolate').click();
    
    // Proceed to checkout
    await page.locator('[data-test="checkout"]').click();
    
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
    
    // Fill form with valid data
    await page.getByRole('textbox', { name: 'Name' }).fill('Test User');
    await page.getByRole('textbox', { name: 'Email' }).fill('test@example.com');
    await page.getByRole('checkbox', { name: 'Promotion checkbox' }).check();
    
    // Submit and verify success
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByText('Thanks for your purchase. Please check your email for payment.')).toBeVisible();
  });

  test('should display correct menu items and prices', async ({ page }) => {
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
  });
});